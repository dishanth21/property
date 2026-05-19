import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaMapMarkerAlt, FaDollarSign, FaBed, FaBath, FaRulerCombined, FaCamera, FaVideo, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from './AuthContext';
import SuccessModal from './SuccessModal';
import axios from 'axios';

const EditProperty = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [property, setProperty] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [video, setVideo] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        property_type: 'house',
        listing_type: 'sale',
        price: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        bedrooms: '',
        bathrooms: '',
        sqft: '',
        year_built: '',
        has_parking: false,
        has_garden: false,
        has_balcony: false,
        has_pool: false,
        has_gym: false,
        has_security: false,
        is_furnished: false,
        is_listed: true,
    });

    useEffect(() => {
        fetchProperty();
    }, [id]);

    const fetchProperty = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`http://127.0.0.1:8000/properties/api/my-properties/`, {
                headers: token ? { 'Authorization': `Token ${token}` } : {},
                withCredentials: true
            });
            
            // Find the property with the matching ID
            const prop = response.data.find(p => p.id === parseInt(id));
            
            if (prop) {
                setProperty(prop);
                setFormData({
                    title: prop.title,
                    description: prop.description,
                    property_type: prop.property_type,
                    listing_type: prop.listing_type,
                    price: prop.price,
                    address: prop.address,
                    city: prop.city,
                    state: prop.state,
                    zip_code: prop.zip_code,
                    bedrooms: prop.bedrooms || '',
                    bathrooms: prop.bathrooms || '',
                    sqft: prop.sqft || '',
                    year_built: prop.year_built || '',
                    has_parking: prop.has_parking,
                    has_garden: prop.has_garden,
                    has_balcony: prop.has_balcony,
                    has_pool: prop.has_pool,
                    has_gym: prop.has_gym,
                    has_security: prop.has_security,
                    is_furnished: prop.is_furnished,
                    is_listed: prop.is_listed,
                });
            } else {
                setError('Property not found');
            }
        } catch (err) {
            console.error('Error fetching property:', err);
            setError('Failed to load property. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files);
        setPhotos(files);
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        setVideo(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setError('No authentication token found. Please login again.');
                navigate('/login');
                return;
            }

            // Create FormData for file upload
            const submitData = new FormData();

            // Add all form fields
            Object.keys(formData).forEach(key => {
                submitData.append(key, formData[key]);
            });

            // Add photos if new ones are provided
            photos.forEach((photo) => {
                submitData.append('photos', photo);
            });

            // Add video if provided
            if (video) {
                submitData.append('video', video);
            }

            const response = await axios.put(
                `http://127.0.0.1:8000/properties/api/${id}/edit/`,
                submitData,
                {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                }
            );
            
            setShowSuccessModal(true);
        } catch (err) {
            console.error('Property update error:', err);
            let errorMessage = 'Failed to update property. Please try again.';
            if (err.response?.status === 401) {
                errorMessage = 'Authentication failed. Please login again.';
            } else if (err.response?.data) {
                if (typeof err.response.data === 'string') {
                    errorMessage = err.response.data;
                } else if (err.response.data.error) {
                    errorMessage = err.response.data.error;
                } else if (err.response.data.detail) {
                    errorMessage = err.response.data.detail;
                } else {
                    const errors = Object.entries(err.response.data)
                        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                        .join('; ');
                    if (errors) errorMessage = errors;
                }
            }
            setError(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    const handleModalClose = () => {
        setShowSuccessModal(false);
        navigate('/dashboard/');
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="container py-5 text-center">
                <h2>Property not found</h2>
                <Link to="/dashboard/" className="btn btn-primary mt-3">Back to Dashboard</Link>
            </div>
        );
    }

    return (
        <div>
            <SuccessModal
                show={showSuccessModal}
                title="Property Updated Successfully!"
                message="Your property has been updated."
                onClose={handleModalClose}
            />
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="d-flex align-items-center mb-4">
                    <Link to="/dashboard/" className="btn btn-outline-secondary me-3">
                        <FaArrowLeft /> Back
                    </Link>
                    <h1 className="fw-bold mb-0">
                        <FaHome className="me-2" />
                        Edit Property
                    </h1>
                </div>

                {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        {error}
                        <button type="button" className="btn-close" onClick={() => setError('')}></button>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Listing Type Section */}
                    <div className="card border-0 shadow-sm mb-4 bg-light">
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-3">Listing Type</h5>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="listing_type"
                                            id="listing_sale"
                                            value="sale"
                                            checked={formData.listing_type === 'sale'}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label fw-bold" htmlFor="listing_sale">
                                            <FaDollarSign className="me-2 text-success" />
                                            Sell Property
                                        </label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="listing_type"
                                            id="listing_rent"
                                            value="rent"
                                            checked={formData.listing_type === 'rent'}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label fw-bold" htmlFor="listing_rent">
                                            <FaHome className="me-2 text-info" />
                                            Rent Property
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Basic Information */}
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0">Basic Information</h5>
                        </div>
                        <div className="card-body p-4">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Property Title *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Property Type *</label>
                                    <select
                                        className="form-select"
                                        name="property_type"
                                        value={formData.property_type}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="apartment">Apartment</option>
                                        <option value="house">House</option>
                                        <option value="villa">Villa</option>
                                        <option value="condo">Condo</option>
                                        <option value="townhouse">Townhouse</option>
                                        <option value="land">Land</option>
                                        <option value="commercial">Commercial</option>
                                        <option value="office">Office</option>
                                        <option value="retail">Retail</option>
                                    </select>
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-bold">Description *</label>
                                    <textarea
                                        className="form-control"
                                        name="description"
                                        rows="4"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0"><FaMapMarkerAlt className="me-2" />Location</h5>
                        </div>
                        <div className="card-body p-4">
                            <div className="row g-3">
                                <div className="col-12">
                                    <label className="form-label fw-bold">Address *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">City *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label fw-bold">State/Province *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label fw-bold">Zip Code *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="zip_code"
                                        value={formData.zip_code}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Size */}
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0"><FaDollarSign className="me-2" />Pricing & Size</h5>
                        </div>
                        <div className="card-body p-4">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Price *</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        step="0.01"
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Year Built</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="year_built"
                                        value={formData.year_built}
                                        onChange={handleChange}
                                        min="1800"
                                        max={new Date().getFullYear()}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Bedrooms</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="bedrooms"
                                        value={formData.bedrooms}
                                        onChange={handleChange}
                                        min="0"
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Bathrooms</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="bathrooms"
                                        value={formData.bathrooms}
                                        onChange={handleChange}
                                        min="0"
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="form-label fw-bold">Square Feet (sqft)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="sqft"
                                        value={formData.sqft}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0">Features & Amenities</h5>
                        </div>
                        <div className="card-body p-4">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name="has_parking"
                                            checked={formData.has_parking}
                                            onChange={handleChange}
                                            id="parking"
                                        />
                                        <label className="form-check-label" htmlFor="parking">Parking</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name="has_garden"
                                            checked={formData.has_garden}
                                            onChange={handleChange}
                                            id="garden"
                                        />
                                        <label className="form-check-label" htmlFor="garden">Garden</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name="has_balcony"
                                            checked={formData.has_balcony}
                                            onChange={handleChange}
                                            id="balcony"
                                        />
                                        <label className="form-check-label" htmlFor="balcony">Balcony</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name="has_pool"
                                            checked={formData.has_pool}
                                            onChange={handleChange}
                                            id="pool"
                                        />
                                        <label className="form-check-label" htmlFor="pool">Swimming Pool</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name="has_gym"
                                            checked={formData.has_gym}
                                            onChange={handleChange}
                                            id="gym"
                                        />
                                        <label className="form-check-label" htmlFor="gym">Gym</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name="has_security"
                                            checked={formData.has_security}
                                            onChange={handleChange}
                                            id="security"
                                        />
                                        <label className="form-check-label" htmlFor="security">Security</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name="is_furnished"
                                            checked={formData.is_furnished}
                                            onChange={handleChange}
                                            id="furnished"
                                        />
                                        <label className="form-check-label" htmlFor="furnished">Furnished</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name="is_listed"
                                            checked={formData.is_listed}
                                            onChange={handleChange}
                                            id="listed"
                                        />
                                        <label className="form-check-label" htmlFor="listed">Listed</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Media */}
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0"><FaCamera className="me-2" />Photos & Videos</h5>
                        </div>
                        <div className="card-body p-4">
                            <div className="row g-3">
                                <div className="col-12">
                                    <label className="form-label fw-bold">Photos</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        multiple
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                    />
                                    <small className="text-muted">Upload new photos to replace existing ones</small>
                                </div>
                                <div className="col-12">
                                    <label className="form-label fw-bold">Video</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        accept="video/*"
                                        onChange={handleVideoChange}
                                    />
                                    <small className="text-muted">Upload a new video to replace the existing one</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="d-flex gap-2 mb-4">
                        <button
                            type="submit"
                            className="btn btn-primary btn-lg fw-bold"
                            disabled={saving}
                        >
                            {saving ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                        <Link to="/dashboard/" className="btn btn-outline-secondary btn-lg fw-bold">
                            Cancel
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default EditProperty;
