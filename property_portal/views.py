from django.shortcuts import render

def index_view(request, *args, **kwargs):
    return render(request, 'accounts/register.html') # Reusing the template we set up for React
