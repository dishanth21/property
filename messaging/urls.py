from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import api_views

router = DefaultRouter()
router.register(r'enquiries', api_views.EnquiryViewSet, basename='enquiry')
router.register(r'messages', api_views.MessageViewSet, basename='message')

app_name = 'messaging'

urlpatterns = [
    # API endpoints (Active - used by React frontend)
    path('api/', include(router.urls)),
]

