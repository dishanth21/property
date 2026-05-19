from rest_framework import generics, filters, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import Property, PropertyImage, PropertyVideo
from .serializers import PropertyListSerializer, PropertyDetailSerializer
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

User = get_user_model()

class PropertyListAPIView(generics.ListAPIView):
    queryset = Property.objects.filter(is_listed=True, is_sold=False, approval_status="approved")
    serializer_class = PropertyListSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'city', 'state']
    ordering_fields = ['price', 'created', 'sqft']
    ordering = ['-created']

class PropertyDetailAPIView(generics.RetrieveAPIView):
    queryset = Property.objects.filter(is_listed=True, approval_status="approved")
    serializer_class = PropertyDetailSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

@method_decorator(csrf_exempt, name='dispatch')
class PropertyCreateAPIView(generics.CreateAPIView):
    serializer_class = PropertyDetailSerializer
    permission_classes = [IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        # Get property data
        property_data = request.data.copy()
        
        # Extract files
        photos = request.FILES.getlist('photos')
        videos = request.FILES.getlist('video')  # Handle both 'video' and 'videos'
        if not videos:
            videos = request.FILES.getlist('videos')
        
        # Create the property
        try:
            serializer = self.get_serializer(data=property_data)
            serializer.is_valid(raise_exception=True)
            property_instance = serializer.save(host=request.user, approval_status="pending")
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        # Handle photo uploads
        for idx, photo in enumerate(photos):
            PropertyImage.objects.create(
                property=property_instance,
                image=photo,
                is_primary=(idx == 0)  # First photo is primary
            )
        
        # Handle video uploads
        for video in videos:
            PropertyVideo.objects.create(
                property=property_instance,
                video=video
            )
        
        # Re-serialize with photos and videos included and proper context
        updated_serializer = self.get_serializer(property_instance, context={'request': request})
        headers = self.get_success_headers(updated_serializer.data)
        return Response(updated_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

# User's Properties (for host)
class UserPropertiesAPIView(generics.ListAPIView):
    serializer_class = PropertyDetailSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Property.objects.filter(host=self.request.user).order_by('-created')

@method_decorator(csrf_exempt, name='dispatch')
class PropertyUpdateAPIView(generics.UpdateAPIView):
    serializer_class = PropertyDetailSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Users can only update their own properties
        return Property.objects.filter(host=self.request.user)
    
    def update(self, request, *args, **kwargs):
        property_instance = self.get_object()
        
        # Get property data
        property_data = request.data.copy()
        
        # Extract files if provided
        photos = request.FILES.getlist('photos')
        videos = request.FILES.getlist('video')
        if not videos:
            videos = request.FILES.getlist('videos')
        
        # Update the property
        try:
            serializer = self.get_serializer(property_instance, data=property_data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        # Handle photo uploads if provided
        if photos:
            # Delete existing images if new ones are provided
            property_instance.images.all().delete()
            for idx, photo in enumerate(photos):
                PropertyImage.objects.create(
                    property=property_instance,
                    image=photo,
                    is_primary=(idx == 0)
                )
        
        # Handle video uploads if provided
        if videos:
            # Delete existing videos if new ones are provided
            property_instance.videos.all().delete()
            for video in videos:
                PropertyVideo.objects.create(
                    property=property_instance,
                    video=video
                )
        
        # Re-serialize with all data
        updated_serializer = self.get_serializer(property_instance, context={'request': request})
        return Response(updated_serializer.data, status=status.HTTP_200_OK)

@method_decorator(csrf_exempt, name='dispatch')
class PropertyDeleteAPIView(generics.DestroyAPIView):
    serializer_class = PropertyDetailSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Users can only delete their own properties
        return Property.objects.filter(host=self.request.user)

# Admin Views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_properties_list(request):
    """Get all properties pending approval"""
    # Check if user is admin
    if not (request.user.is_staff or request.user.is_admin_user):
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
    
    properties = Property.objects.all().order_by('-created')
    serializer = PropertyDetailSerializer(properties, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def approve_property(request, pk):
    """Admin approves a property"""
    # Check if user is admin
    if not (request.user.is_staff or request.user.is_admin_user):
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        property_obj = Property.objects.get(pk=pk)
        property_obj.approval_status = "approved"
        property_obj.approved_by = request.user
        property_obj.approval_date = timezone.now()
        property_obj.is_listed = True  # Mark as listed when approved
        property_obj.save()
        
        serializer = PropertyDetailSerializer(property_obj, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Property.DoesNotExist:
        return Response({'error': 'Property not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reject_property(request, pk):
    """Admin rejects a property"""
    # Check if user is admin
    if not (request.user.is_staff or request.user.is_admin_user):
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        property_obj = Property.objects.get(pk=pk)
        rejection_reason = request.data.get('reason', '')
        
        property_obj.approval_status = "rejected"
        property_obj.rejection_reason = rejection_reason
        property_obj.approved_by = request.user
        property_obj.approval_date = timezone.now()
        property_obj.save()
        
        serializer = PropertyDetailSerializer(property_obj, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Property.DoesNotExist:
        return Response({'error': 'Property not found'}, status=status.HTTP_404_NOT_FOUND)
