from django.contrib import admin
from .models import Enquiry, Message

class MessageInline(admin.TabularInline):
    model = Message
    extra = 0
    readonly_fields = ('created',)

@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
    list_display = ('property', 'sender', 'recipient', 'status', 'created')
    list_filter = ('status', 'created', 'property__property_type')
    search_fields = ('property__title', 'sender__username', 'recipient__username', 'subject')
    inlines = [MessageInline]
    readonly_fields = ('created', 'updated')
    
    fieldsets = (
        ('Enquiry Details', {
            'fields': ('property', 'sender', 'recipient', 'subject', 'message', 'status')
        }),
        ('Contact Information', {
            'fields': ('phone', 'email')
        }),
        ('Timestamps', {
            'fields': ('created', 'updated'),
            'classes': ('collapse',)
        }),
    )

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('enquiry', 'sender', 'created')
    list_filter = ('created',)
    search_fields = ('enquiry__property__title', 'sender__username', 'content')
    readonly_fields = ('created',)
