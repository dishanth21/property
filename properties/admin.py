from django.contrib import admin
from .models import Property, PropertyImage, PropertyFeature

class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1

class PropertyFeatureInline(admin.TabularInline):
    model = PropertyFeature
    extra = 1

@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ('title', 'host', 'city', 'property_type', 'listing_type', 'price', 'is_listed', 'is_featured', 'created')
    list_filter = ('property_type', 'listing_type', 'is_listed', 'is_featured', 'is_sold', 'city', 'created')
    search_fields = ('title', 'description', 'address', 'city', 'host__username')
    list_editable = ('is_listed', 'is_featured')
    inlines = [PropertyImageInline, PropertyFeatureInline]
    readonly_fields = ('created', 'updated')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('host', 'title', 'description', 'property_type', 'listing_type')
        }),
        ('Location', {
            'fields': ('address', 'city', 'state', 'zip_code', 'country')
        }),
        ('Pricing', {
            'fields': ('price', 'price_per_sqft')
        }),
        ('Property Details', {
            'fields': ('bedrooms', 'bathrooms', 'sqft', 'lot_size', 'year_built')
        }),
        ('Features', {
            'fields': ('has_parking', 'has_garden', 'has_balcony', 'has_pool', 'has_gym', 'has_security', 'is_furnished')
        }),
        ('Status', {
            'fields': ('is_listed', 'is_featured', 'is_sold')
        }),
        ('Timestamps', {
            'fields': ('created', 'updated'),
            'classes': ('collapse',)
        }),
    )

@admin.register(PropertyImage)
class PropertyImageAdmin(admin.ModelAdmin):
    list_display = ('property', 'is_primary', 'created')
    list_filter = ('is_primary', 'created')
    search_fields = ('property__title',)

@admin.register(PropertyFeature)
class PropertyFeatureAdmin(admin.ModelAdmin):
    list_display = ('property', 'feature_name')
    search_fields = ('property__title', 'feature_name')
