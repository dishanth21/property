from django.urls import path
from django.contrib.auth import views as auth_views
from . import views, api_views

app_name = 'accounts'

urlpatterns = [
    # Old Django template views - DISABLED (using React SPA instead)
    # path('register/', views.register, name='register'),
    # path('verify-otp/', views.verify_otp, name='verify_otp'),
    # path('login/', views.login_view, name='login'),
    # path('logout/', views.logout_view, name='logout'),
    # path('profile/', views.profile, name='profile'),
    # path('profile/edit/', views.edit_profile, name='edit_profile'),
    # path('dashboard/', views.dashboard, name='dashboard'),

    # Password Reset URLs - DISABLED (can be re-enabled if needed)
    # path('password_reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    # path('password_reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    # path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    # path('reset/done/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),

    # API URLs (Active - used by React frontend)
    path('api/csrf/', api_views.GetCSRFToken.as_view(), name='api_csrf'),
    path('api/register/', api_views.RegisterAPIView.as_view(), name='api_register'),
    path('api/verify-otp/', api_views.VerifyOTPAPIView.as_view(), name='api_verify_otp'),
    path('api/login/', api_views.LoginAPIView.as_view(), name='api_login'),
    path('api/user/', api_views.UserAPIView.as_view(), name='api_user'),
    path('api/logout/', api_views.LogoutAPIView.as_view(), name='api_logout'),
]
