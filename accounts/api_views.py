import uuid
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.conf import settings
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.utils.decorators import method_decorator
from django.middleware.csrf import get_token
import random
from .serializers import UserRegistrationSerializer, OTPVerificationSerializer

User = get_user_model()

# CSRF Token endpoint
@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    def get(self, request):
        # This will ensure the CSRF cookie is set
        csrf_token = get_token(request)
        return Response({'csrfToken': csrf_token}, status=status.HTTP_200_OK)

class RegisterAPIView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.is_active = True  # Directly activate user without OTP
            user.save()
            
            return Response({
                'message': 'Registration successful. You can now login.',
                'user_id': user.id,
                'username': user.username,
                'email': user.email
            }, status=status.HTTP_201_CREATED)
        
        # Format errors for frontend
        errors = {}
        for field, messages in serializer.errors.items():
            errors[field] = messages[0] if isinstance(messages, list) else str(messages)
        
        return Response({
            'message': 'Registration failed. Please fix the errors below.',
            'errors': errors
        }, status=status.HTTP_400_BAD_REQUEST)

class VerifyOTPAPIView(APIView):
    def post(self, request):
        serializer = OTPVerificationSerializer(data=request.data)
        if serializer.is_valid():
            otp_entered = serializer.validated_data['otp']
            otp_session = request.session.get('otp')
            user_id = request.session.get('user_id')
            
            if otp_entered and otp_session and otp_entered == otp_session:
                try:
                    user = User.objects.get(id=user_id)
                    user.is_active = True
                    user.save()
                    
                    # Clear session
                    del request.session['otp']
                    del request.session['user_id']
                    
                    # Login
                    login(request, user)
                    
                    return Response({
                        'message': 'Account verified successfully!',
                        'redirect_url': '/properties/'
                    }, status=status.HTTP_200_OK)
                except User.DoesNotExist:
                    return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class LoginAPIView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            if not user.is_active:
                return Response({'error': 'Account is inactive. Please verify OTP.'}, status=status.HTTP_403_FORBIDDEN)
            
            login(request, user)
            
            # Get or create token using Django REST Framework's Token
            token, created = Token.objects.get_or_create(user=user)
            
            return Response({
                'message': 'Login successful',
                'token': token.key,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'is_host': user.is_host,
                    'is_buyer': user.is_buyer,
                    'is_admin': user.is_staff or user.is_admin_user
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class UserAPIView(APIView):
    def get(self, request):
        user = request.user
        
        # If not authenticated via session, try token authentication (DRF will handle this automatically)
        if not user.is_authenticated:
            return Response({'error': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_host': user.is_host,
            'is_buyer': user.is_buyer,
            'is_admin': user.is_staff or user.is_admin_user
        }, status=status.HTTP_200_OK)

@method_decorator(csrf_exempt, name='dispatch')
class LogoutAPIView(APIView):
    def post(self, request):
        logout(request)
        return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)
