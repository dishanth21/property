"""
Custom middleware to handle CSRF for token-based authentication
"""
from django.middleware.csrf import CsrfViewMiddleware
from django.utils.deprecation import MiddlewareMixin

class TokenAuthCSRFMiddleware(MiddlewareMixin):
    """
    Allow CSRF-exempt requests when using token authentication.
    If Authorization header is present with Token, skip CSRF check.
    """
    
    def process_request(self, request):
        # If request has Authorization header with Token, mark as CSRF exempt
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        if auth_header.startswith('Token '):
            # Mark request to skip CSRF check
            request._dont_enforce_csrf_checks = True
        return None
