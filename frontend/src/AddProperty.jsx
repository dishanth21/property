import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaMapMarkerAlt, FaDollarSign, FaBed, FaBath, FaRulerCombined, FaCamera, FaVideo } from 'react-icons/fa';
import { useAuth } from './AuthContext';
import SuccessModal from './SuccessModal';
import axios from 'axios';

const AddProperty = () => {
    const { user, checkAuthStatus } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
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
    });

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
        setLoading(true);
        setError('');

        try {
            // Check if we have a token
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

            // Add photos
            photos.forEach((photo) => {
                submitData.append('photos', photo);
            });

            // Add video if exists
            if (video) {
                submitData.append('video', video);
            }

            const response = await axios.post('http://127.0.0.1:8000/properties/api/create/', submitData, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            
            // Show success modal
            setShowSuccessModal(true);
        } catch (err) {
            // Show detailed error message
            let errorMessage = 'Failed to create property. Please try again.';
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
                    // Show validation errors
                    const errors = Object.entries(err.response.data)
                        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                        .join('; ');
                    if (errors) errorMessage = errors;
                }
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleModalClose = () => {
        setShowSuccessModal(false);
        navigate('/dashboard/');
    };

    return (
        <div>
            <SuccessModal
                show={showSuccessModal}
                title="Property Added Successfully!"
                message="Your property has been submitted. Admin will review and approve it shortly."
                onClose={handleModalClose}
            />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="fw-bold mb-4">
                    <FaHome className="me-2" />
                    Add New Property
                </h1>

                {/* Listing Type Section */}
                <div className="card border-0 shadow-sm mb-4 bg-light">
                    <div className="card-body p-4">
                        <h5 className="fw-bold mb-3">What do you want to do with this property?</h5>
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
                                    <small className="d-block text-muted ms-4">I want to sell my property</small>
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
                                    <small className="d-block text-muted ms-4">I want to rent out my property</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="alert alert-danger">{error}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0">Basic Information</h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-8 mb-3">
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
                                <div className="col-md-4 mb-3">
                                    <label className="form-label fw-bold">Property Type *</label>
                                    <select
                                        className="form-select"
                                        name="property_type"
                                        value={formData.property_type}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="house">House</option>
                                        <option value="apartment">Apartment</option>
                                        <option value="condo">Condo</option>
                                        <option value="land">Land</option>
                                        <option value="commercial">Commercial</option>
                                    </select>
                                </div>
                                <div className="col-12 mb-3">
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
                                <div className="col-md-4 mb-3">
                                    <label className="form-label fw-bold">
                                        <FaDollarSign /> Price (₹) *
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-header bg-success text-white">
                            <h5 className="mb-0">
                                <FaMapMarkerAlt className="me-2" />
                                Location
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-12 mb-3">
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
                                <div className="col-md-4 mb-3">
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
                                <div className="col-md-4 mb-3">
                                    <label className="form-label fw-bold">State *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="form-label fw-bold">ZIP Code *</label>
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

                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-header bg-info text-white">
                            <h5 className="mb-0">Property Details</h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-3 mb-3">
                                    <label className="form-label fw-bold">
                                        <FaBed className="me-1" /> Bedrooms
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="bedrooms"
                                        value={formData.bedrooms}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label fw-bold">
                                        <FaBath className="me-1" /> Bathrooms
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="bathrooms"
                                        value={formData.bathrooms}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label fw-bold">
                                        <FaRulerCombined className="me-1" /> Sqft
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="sqft"
                                        value={formData.sqft}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label fw-bold">Year Built</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="year_built"
                                        value={formData.year_built}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-header bg-secondary text-white">
                            <h5 className="mb-0">
                                <FaCamera className="me-2" />
                                Media Upload
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-bold">Property Photos</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        accept="image/*"
                                        multiple
                                        onChange={handlePhotoChange}
                                    />
                                    <small className="text-muted">You can select multiple photos</small>
                                    {photos.length > 0 && (
                                        <div className="mt-2">
                                            <span className="badge bg-success">{photos.length} photo(s) selected</span>
                                        </div>
                                    )}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-bold">
                                        <FaVideo className="me-1" />
                                        Property Video (Optional)
                                    </label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        accept="video/*"
                                        onChange={handleVideoChange}
                                    />
                                    <small className="text-muted">Upload a video tour of the property</small>
                                    {video && (
                                        <div className="mt-2">
                                            <span className="badge bg-success">Video selected: {video.name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-header bg-warning">
                            <h5 className="mb-0">Features & Amenities</h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-4 mb-2">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name="has_parking"
                                            checked={formData.has_parking}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label">Parking</label>
                                    </div>
                                </div>
                                <div className="col-md-4 mb-2">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name="has_garden"
                                            checked={formData.has_garden}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label">Garden</label>
                                    </div>
                                </div>
                                <div className="col-md-4 mb-2">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name="has_balcony"
                                            checked={formData.has_balcony}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label">Balcony</label>
                                    </div>
                                </div>
                                <div className="col-md-4 mb-2">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name="has_pool"
                                            checked={formData.has_pool}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label">Swimming Pool</label>
                                    </div>
                                </div>
                                <div className="col-md-4 mb-2">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name="has_gym"
                                            checked={formData.has_gym}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label">Gym</label>
                                    </div>
                                </div>
                                <div className="col-md-4 mb-2">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name="has_security"
                                            checked={formData.has_security}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label">Security</label>
                                    </div>
                                </div>
                                <div className="col-md-4 mb-2">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name="is_furnished"
                                            checked={formData.is_furnished}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label">Furnished</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex gap-3">
                        <motion.button
                            type="submit"
                            className="btn btn-primary btn-lg px-5"
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {loading ? 'Creating...' : 'Create Property'}
                        </motion.button>
                        <Link to="/dashboard/" className="btn btn-outline-secondary btn-lg px-5">
                            Cancel
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AddProperty;
