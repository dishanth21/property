from rest_framework import serializers
from .models import Enquiry, Message
from accounts.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone', 'is_host']

class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    sender_detail = UserSerializer(source='sender', read_only=True)
    
    class Meta:
        model = Message
        fields = ['id', 'sender', 'sender_username', 'sender_detail', 'content', 'created']
        read_only_fields = ['created']

class EnquirySerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    recipient_username = serializers.CharField(source='recipient.username', read_only=True)
    property_title = serializers.CharField(source='property.title', read_only=True)
    property_id = serializers.IntegerField(source='property.id', read_only=True)
    
    class Meta:
        model = Enquiry
        fields = ['id', 'property_id', 'property_title', 'sender', 'sender_username', 
                  'recipient', 'recipient_username', 'subject', 'message', 'status', 
                  'phone', 'email', 'created', 'updated']
        read_only_fields = ['created', 'updated']

class EnquiryDetailSerializer(serializers.ModelSerializer):
    """Detailed enquiry view with all messages"""
    sender_detail = UserSerializer(source='sender', read_only=True)
    recipient_detail = UserSerializer(source='recipient', read_only=True)
    property_title = serializers.CharField(source='property.title', read_only=True)
    property_id = serializers.IntegerField(source='property.id', read_only=True)
    messages = MessageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Enquiry
        fields = ['id', 'property_id', 'property_title', 'sender_detail', 'recipient_detail',
                  'subject', 'message', 'status', 'phone', 'email', 'created', 'updated', 'messages']
        read_only_fields = ['created', 'updated']
