from django.urls import path
from . import api_views

app_name = 'properties'

urlpatterns = [
    # API URLs (Active - used by React frontend)
    path('api/', api_views.PropertyListAPIView.as_view(), name='api_property_list'),
    path('api/<int:pk>/', api_views.PropertyDetailAPIView.as_view(), name='api_property_detail'),
    path('api/create/', api_views.PropertyCreateAPIView.as_view(), name='api_property_create'),
    path('api/my-properties/', api_views.UserPropertiesAPIView.as_view(), name='api_user_properties'),
    path('api/<int:pk>/edit/', api_views.PropertyUpdateAPIView.as_view(), name='api_property_update'),
    path('api/<int:pk>/delete/', api_views.PropertyDeleteAPIView.as_view(), name='api_property_delete'),
    
    # Admin APIs
    path('api/admin/properties/', api_views.admin_properties_list, name='api_admin_properties'),
    path('api/admin/<int:pk>/approve/', api_views.approve_property, name='api_approve_property'),
    path('api/admin/<int:pk>/reject/', api_views.reject_property, name='api_reject_property'),
]
