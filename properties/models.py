from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator

class Property(models.Model):
    PROPERTY_TYPES = [
        ("apartment", "Apartment"),
        ("house", "House"),
        ("villa", "Villa"),
        ("condo", "Condo"),
        ("townhouse", "Townhouse"),
        ("land", "Land"),
        ("commercial", "Commercial"),
        ("office", "Office"),
        ("retail", "Retail"),
    ]
    
    LISTING_TYPES = [
        ("sale", "For Sale"),
        ("rent", "For Rent"),
        ("lease", "For Lease"),
    ]
    
    host = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="properties")
    title = models.CharField(max_length=200)
    description = models.TextField()
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100, default="India")
    
    # Pricing
    price = models.DecimalField(max_digits=12, decimal_places=2)
    listing_type = models.CharField(max_length=20, choices=LISTING_TYPES, default="sale")
    price_per_sqft = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Property Details
    property_type = models.CharField(max_length=50, choices=PROPERTY_TYPES)
    bedrooms = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    bathrooms = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    sqft = models.PositiveIntegerField(null=True, blank=True)
    lot_size = models.PositiveIntegerField(null=True, blank=True, help_text="Lot size in sqft")
    year_built = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(1800), MaxValueValidator(2024)])
    
    # Features
    has_parking = models.BooleanField(default=False)
    has_garden = models.BooleanField(default=False)
    has_balcony = models.BooleanField(default=False)
    has_pool = models.BooleanField(default=False)
    has_gym = models.BooleanField(default=False)
    has_security = models.BooleanField(default=False)
    is_furnished = models.BooleanField(default=False)
    
    # Status
    is_listed = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    is_sold = models.BooleanField(default=False)
    
    # Admin Approval
    APPROVAL_STATUS = [
        ("pending", "Pending Approval"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]
    approval_status = models.CharField(max_length=20, choices=APPROVAL_STATUS, default="pending")
    approved_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="approved_properties")
    approval_date = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True, null=True)

    # Location (Google Maps)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    # Timestamps
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created']
        verbose_name_plural = "Properties"
    
    def __str__(self):
        return f"{self.title} - {self.city}"

class PropertyImage(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="properties/")
    is_primary = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-is_primary', 'created']
    
    def __str__(self):
        return f"{self.property.title} - Image {self.id}"

class PropertyVideo(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="videos")
    video = models.FileField(upload_to="properties/videos/")
    created = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created']
    
    def __str__(self):
        return f"{self.property.title} - Video {self.id}"

class PropertyFeature(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="features")
    feature_name = models.CharField(max_length=100)
    
    def __str__(self):
        return f"{self.property.title} - {self.feature_name}"

