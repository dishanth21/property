from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from .views import index_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts.urls')),
    path('properties/', include('properties.urls')),
    path('messaging/', include('messaging.urls')),
    
    # Catch-all for React SPA - Must be last!
    # Only match routes that don't have a dot (to avoid matching files) and aren't API/admin routes
    re_path(r'^(?!api|admin|media|static).*$', index_view, name='index'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
