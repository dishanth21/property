from django import forms
from .models import Property, PropertyImage, PropertyFeature

class PropertyForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Allow leaving country empty; we'll fall back to default
        self.fields['country'].required = False
        if not self.initial.get('country'):
            self.initial['country'] = 'India'

    def clean_country(self):
        country = self.cleaned_data.get('country')
        return country or 'India'

    class Meta:
        model = Property
        fields = [
            'title', 'description', 'address', 'city', 'state', 'zip_code', 'country',
            'price', 'listing_type', 'property_type', 'bedrooms', 'bathrooms', 'sqft',
            'lot_size', 'year_built', 'has_parking', 'has_garden', 'has_balcony',
            'has_pool', 'has_gym', 'has_security', 'is_furnished', 'is_featured',
            'latitude', 'longitude'
        ]
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-control'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'rows': 4}),
            'address': forms.TextInput(attrs={'class': 'form-control', 'id': 'id_address', 'placeholder': 'Start typing an address...'}),
            'city': forms.TextInput(attrs={'class': 'form-control', 'id': 'id_city'}),
            'state': forms.TextInput(attrs={'class': 'form-control', 'id': 'id_state'}),
            'zip_code': forms.TextInput(attrs={'class': 'form-control', 'id': 'id_zip'}),
            'country': forms.TextInput(attrs={'class': 'form-control', 'id': 'id_country'}),
            'price': forms.NumberInput(attrs={'class': 'form-control'}),
            'listing_type': forms.Select(attrs={'class': 'form-control'}),
            'property_type': forms.Select(attrs={'class': 'form-control'}),
            'bedrooms': forms.NumberInput(attrs={'class': 'form-control'}),
            'bathrooms': forms.NumberInput(attrs={'class': 'form-control'}),
            'sqft': forms.NumberInput(attrs={'class': 'form-control'}),
            'lot_size': forms.NumberInput(attrs={'class': 'form-control'}),
            'year_built': forms.NumberInput(attrs={'class': 'form-control'}),
            'has_parking': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'has_garden': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'has_balcony': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'has_pool': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'has_gym': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'has_security': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'is_furnished': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'is_featured': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'latitude': forms.HiddenInput(attrs={'id': 'id_latitude'}),
            'longitude': forms.HiddenInput(attrs={'id': 'id_longitude'}),
        }
    class Meta:
        model = Property
        fields = [
            'title', 'description', 'address', 'city', 'state', 'zip_code', 'country',
            'price', 'listing_type', 'property_type', 'bedrooms', 'bathrooms', 'sqft',
            'lot_size', 'year_built', 'has_parking', 'has_garden', 'has_balcony',
            'has_pool', 'has_gym', 'has_security', 'is_furnished', 'is_featured'
        ]
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-control'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'rows': 4}),
            'address': forms.Textarea(attrs={'class': 'form-control', 'rows': 2}),
            'city': forms.TextInput(attrs={'class': 'form-control'}),
            'state': forms.TextInput(attrs={'class': 'form-control'}),
            'zip_code': forms.TextInput(attrs={'class': 'form-control'}),
            'country': forms.TextInput(attrs={'class': 'form-control'}),
            'price': forms.NumberInput(attrs={'class': 'form-control'}),
            'listing_type': forms.Select(attrs={'class': 'form-control'}),
            'property_type': forms.Select(attrs={'class': 'form-control'}),
            'bedrooms': forms.NumberInput(attrs={'class': 'form-control'}),
            'bathrooms': forms.NumberInput(attrs={'class': 'form-control'}),
            'sqft': forms.NumberInput(attrs={'class': 'form-control'}),
            'lot_size': forms.NumberInput(attrs={'class': 'form-control'}),
            'year_built': forms.NumberInput(attrs={'class': 'form-control'}),
            'has_parking': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'has_garden': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'has_balcony': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'has_pool': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'has_gym': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'has_security': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'is_furnished': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'is_featured': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }

class PropertyImageForm(forms.ModelForm):
    class Meta:
        model = PropertyImage
        fields = ['image', 'is_primary']
        widgets = {
            'image': forms.FileInput(attrs={'class': 'form-control'}),
            'is_primary': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }

class PropertyFeatureForm(forms.ModelForm):
    class Meta:
        model = PropertyFeature
        fields = ['feature_name']
        widgets = {
            'feature_name': forms.TextInput(attrs={'class': 'form-control'}),
        }

