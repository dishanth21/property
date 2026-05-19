from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import Enquiry, Message
from .serializers import EnquirySerializer, MessageSerializer, EnquiryDetailSerializer
from properties.models import Property

class EnquiryViewSet(viewsets.ModelViewSet):
    """ViewSet for Enquiry management"""
    permission_classes = [IsAuthenticated]
    serializer_class = EnquirySerializer
    
    def get_queryset(self):
        user = self.request.user
        # Get enquiries where user is sender or recipient
        return Enquiry.objects.filter(
            Q(sender=user) | Q(recipient=user)
        ).distinct()
    
    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)
    
    @action(detail=False, methods=['get'])
    def received(self, request):
        """Get enquiries received by the current user"""
        enquiries = Enquiry.objects.filter(recipient=request.user)
        serializer = self.get_serializer(enquiries, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def sent(self, request):
        """Get enquiries sent by the current user"""
        enquiries = Enquiry.objects.filter(sender=request.user)
        serializer = self.get_serializer(enquiries, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def detail(self, request, pk=None):
        """Get detailed view of an enquiry with all messages"""
        enquiry = self.get_object()
        # Check permission
        if enquiry.sender != request.user and enquiry.recipient != request.user:
            return Response(
                {'error': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Mark as read if user is recipient
        if enquiry.recipient == request.user and enquiry.status == 'new':
            enquiry.status = 'read'
            enquiry.save()
        
        serializer = EnquiryDetailSerializer(enquiry)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        """Send a message in an enquiry thread"""
        enquiry = self.get_object()
        
        # Check if user is part of the conversation
        if enquiry.sender != request.user and enquiry.recipient != request.user:
            return Response(
                {'error': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        content = request.data.get('content', '').strip()
        if not content:
            return Response(
                {'error': 'Message content cannot be empty'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create message
        message = Message.objects.create(
            enquiry=enquiry,
            sender=request.user,
            content=content
        )
        
        # Update enquiry status to replied
        if enquiry.status != 'replied':
            enquiry.status = 'replied'
            enquiry.save()
        
        serializer = MessageSerializer(message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['post'])
    def create_enquiry(self, request):
        """Create an enquiry for a property"""
        property_id = request.data.get('property_id')
        message = request.data.get('message', '').strip()
        
        if not property_id or not message:
            return Response(
                {'error': 'Property ID and message are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        property_obj = get_object_or_404(Property, pk=property_id)
        
        # Don't allow users to enquire about their own properties
        if property_obj.host == request.user:
            return Response(
                {'error': 'You cannot enquire about your own property'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create enquiry
        enquiry = Enquiry.objects.create(
            property=property_obj,
            sender=request.user,
            recipient=property_obj.host,
            message=message,
            subject=f"Enquiry about {property_obj.title}",
            email=request.user.email,
            phone=getattr(request.user, 'phone', '')
        )
        
        serializer = EnquirySerializer(enquiry)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class MessageViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Message management (read-only)"""
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer
    
    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(
            enquiry__sender=user
        ) | Message.objects.filter(
            enquiry__recipient=user
        )
