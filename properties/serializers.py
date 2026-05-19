from rest_framework import serializers
from .models import Property, PropertyImage, PropertyVideo

class PropertyImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = PropertyImage
        fields = ['id', 'image', 'is_primary']
    
    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image:
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

class PropertyVideoSerializer(serializers.ModelSerializer):
    video = serializers.SerializerMethodField()
    
    class Meta:
        model = PropertyVideo
        fields = ['id', 'video']
    
    def get_video(self, obj):
        request = self.context.get('request')
        if obj.video:
            if request:
                return request.build_absolute_uri(obj.video.url)
            return obj.video.url
        return None

class PropertyListSerializer(serializers.ModelSerializer):
    host_name = serializers.CharField(source='host.username', read_only=True)
    primary_image = serializers.SerializerMethodField()
    
    class Meta:
        model = Property
        fields = ['id', 'title', 'city', 'state', 'price', 'listing_type', 
                  'property_type', 'bedrooms', 'bathrooms', 'sqft', 'is_featured',
                  'host_name', 'primary_image', 'created', 'approval_status']
    
    def get_primary_image(self, obj):
        request = self.context.get('request')
        primary = obj.images.filter(is_primary=True).first()
        if primary:
            if request:
                return request.build_absolute_uri(primary.image.url)
            return primary.image.url
        first_image = obj.images.first()
        if first_image:
            if request:
                return request.build_absolute_uri(first_image.image.url)
            return first_image.image.url
        return None

class PropertyDetailSerializer(serializers.ModelSerializer):
    host_name = serializers.CharField(source='host.username', read_only=True)
    host_email = serializers.EmailField(source='host.email', read_only=True)
    host_phone = serializers.CharField(source='host.phone', read_only=True)
    images = serializers.SerializerMethodField()
    videos = serializers.SerializerMethodField()
    
    class Meta:
        model = Property
        fields = '__all__'
        extra_kwargs = {
            'host': {'read_only': True},
            'approved_by': {'read_only': True},
            'approval_date': {'read_only': True},
        }
    
    def get_images(self, obj):
        images = obj.images.all()
        serializer = PropertyImageSerializer(images, many=True, context=self.context)
        return serializer.data
    
    def get_videos(self, obj):
        videos = obj.videos.all()
        serializer = PropertyVideoSerializer(videos, many=True, context=self.context)
        return serializer.data
