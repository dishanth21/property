import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaCalendar, FaUser, FaEnvelope, FaCheckCircle, FaTimesCircle, FaClock, FaChevronLeft, FaChevronRight, FaPlayCircle } from 'react-icons/fa';
import { useAuth } from './AuthContext';

const PropertyDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        fetchProperty();
    }, [id]);

    const fetchProperty = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/properties/api/${id}/`, {
                withCredentials: true
            });
            setProperty(response.data);
            setCurrentImageIndex(0);
        } catch (error) {
            console.error('Error fetching property:', error);
        } finally {
            setLoading(false);
        }
    };

    const nextImage = () => {
        if (property && property.images && property.images.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
        }
    };

    const prevImage = () => {
        if (property && property.images && property.images.length > 0) {
            setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return <span className="badge bg-success"><FaCheckCircle className="me-1" />Approved</span>;
            case 'pending':
                return <span className="badge bg-warning"><FaClock className="me-1" />Pending Approval</span>;
            case 'rejected':
                return <span className="badge bg-danger"><FaTimesCircle className="me-1" />Rejected</span>;
            default:
                return <span className="badge bg-secondary">Unknown</span>;
        }
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
                <Link to="/properties/" className="btn btn-primary mt-3">Back to Properties</Link>
            </div>
        );
    }

    const isOwner = user && user.id === property.host;

    return (
        <div>
            {/* Hero Image with Gallery */}
            {property.images && property.images.length > 0 ? (
                <div className="position-relative" style={{ height: '500px', overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
                    <motion.img
                        key={currentImageIndex}
                        src={property.images[currentImageIndex].image}
                        alt={property.title}
                        className="w-100 h-100"
                        style={{ objectFit: 'cover' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    />
                    <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-25"></div>

                    {/* Navigation Arrows */}
                    {property.images.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="btn btn-light position-absolute start-0 top-50 translate-middle-y ms-3"
                                style={{ zIndex: 10 }}
                                aria-label="Previous image"
                            >
                                <FaChevronLeft />
                            </button>
                            <button
                                onClick={nextImage}
                                className="btn btn-light position-absolute end-0 top-50 translate-middle-y me-3"
                                style={{ zIndex: 10 }}
                                aria-label="Next image"
                            >
                                <FaChevronRight />
                            </button>
                        </>
                    )}

                    {/* Image Counter */}
                    {property.images.length > 1 && (
                        <div className="position-absolute bottom-0 end-0 m-3 bg-dark bg-opacity-75 text-white px-3 py-2 rounded">
                            {currentImageIndex + 1} / {property.images.length}
                        </div>
                    )}
                </div>
            ) : (
                <div className="position-relative" style={{ height: '400px', overflow: 'hidden', backgroundColor: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p className="text-muted">No images available</p>
                </div>
            )}

            <div className="container py-5">
                <>
                    {/* Status Alert for Host */}
                    {isOwner && (
                        <div className="row mb-4">
                            <div className="col-12">
                                <>
                                    {property.approval_status === 'rejected' && (
                                        <motion.div
                                            className="alert alert-danger d-flex align-items-start"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            <FaTimesCircle className="me-3 mt-1 flex-shrink-0" />
                                            <div>
                                                <h4 className="alert-heading">Property Rejected</h4>
                                                <p className="mb-0">Your property has been rejected by the admin.</p>
                                                {property.rejection_reason && (
                                                    <p className="mb-0 mt-2"><strong>Reason:</strong> {property.rejection_reason}</p>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                    {property.approval_status === 'pending' && (
                                        <motion.div
                                            className="alert alert-warning d-flex align-items-start"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            <FaClock className="me-3 mt-1 flex-shrink-0" />
                                            <div>
                                                <h4 className="alert-heading">Pending Approval</h4>
                                                <p className="mb-0">Your property is awaiting admin approval. It will not be visible to buyers until approved.</p>
                                            </div>
                                        </motion.div>
                                    )}
                                    {property.approval_status === 'approved' && (
                                        <motion.div
                                            className="alert alert-success d-flex align-items-start"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            <FaCheckCircle className="me-3 mt-1 flex-shrink-0" />
                                            <div>
                                                <h4 className="alert-heading">Property Approved!</h4>
                                                <p className="mb-0">Your property has been approved and is now visible to all buyers.</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </>
                            </div>
                        </div>
                    )}

                    <div className="row">
                        {/* Main Content */}
                        <div className="col-lg-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <h1 className="fw-bold mb-0">{property.title}</h1>
                                            <span className={`badge ${property.listing_type === 'rent' ? 'bg-info' : 'bg-success'}`}>
                                                {property.listing_type === 'rent' ? 'For Rent' : 'For Sale'}
                                            </span>
                                        </div>
                                        <p className="text-muted">
                                            <FaMapMarkerAlt className="me-2" />
                                            {property.address}, {property.city}, {property.state} {property.zip_code}
                                        </p>
                                    </div>
                                    <h2 className="text-primary">₹{Number(property.price).toLocaleString()}</h2>
                                </div>

                                {/* Property Stats */}
                                <div className="card border-0 shadow-sm mb-4">
                                    <div className="card-body">
                                        <div className="row text-center">
                                            {property.bedrooms > 0 && (
                                                <div className="col-3">
                                                    <FaBed className="text-primary fa-2x mb-2" />
                                                    <p className="mb-0 fw-bold">{property.bedrooms}</p>
                                                    <small className="text-muted">Bedrooms</small>
                                                </div>
                                            )}
                                            {property.bathrooms > 0 && (
                                                <div className="col-3">
                                                    <FaBath className="text-primary fa-2x mb-2" />
                                                    <p className="mb-0 fw-bold">{property.bathrooms}</p>
                                                    <small className="text-muted">Bathrooms</small>
                                                </div>
                                            )}
                                            {property.sqft && (
                                                <div className="col-3">
                                                    <FaRulerCombined className="text-primary fa-2x mb-2" />
                                                    <p className="mb-0 fw-bold">{property.sqft}</p>
                                                    <small className="text-muted">Sqft</small>
                                                </div>
                                            )}
                                            {property.year_built && (
                                                <div className="col-3">
                                                    <FaCalendar className="text-primary fa-2x mb-2" />
                                                    <p className="mb-0 fw-bold">{property.year_built}</p>
                                                    <small className="text-muted">Year Built</small>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="card border-0 shadow-sm mb-4">
                                    <div className="card-body">
                                        <h4 className="fw-bold mb-3">Description</h4>
                                        <p className="text-muted">{property.description}</p>
                                    </div>
                                </div>

                                {/* Photo Gallery */}
                                {property.images && property.images.length > 0 && (
                                    <div className="card border-0 shadow-sm mb-4">
                                        <div className="card-body">
                                            <h4 className="fw-bold mb-3">Photo Gallery</h4>
                                            <div className="row g-3">
                                                {property.images.map((image, index) => (
                                                    <motion.div
                                                        key={image.id}
                                                        className="col-md-4 col-sm-6"
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: index * 0.1 }}
                                                    >
                                                        <div
                                                            className="position-relative overflow-hidden rounded"
                                                            style={{ cursor: 'pointer', height: '200px' }}
                                                            onClick={() => setCurrentImageIndex(index)}
                                                        >
                                                            <img
                                                                src={image.image}
                                                                alt={`Property ${index + 1}`}
                                                                className="w-100 h-100"
                                                                style={{ objectFit: 'cover', transition: 'transform 0.3s' }}
                                                                onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                                                                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                                            />
                                                            {image.is_primary && (
                                                                <div className="position-absolute top-0 end-0 m-2 bg-primary text-white px-2 py-1 rounded small">
                                                                    Primary
                                                                </div>
                                                            )}
                                                            <div className="position-absolute inset-0 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0)', transition: 'background-color 0.3s' }}
                                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.3)'}
                                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0)'}
                                                            >
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Video Gallery */}
                                {property.videos && property.videos.length > 0 && (
                                    <div className="card border-0 shadow-sm mb-4">
                                        <div className="card-body">
                                            <h4 className="fw-bold mb-3">
                                                <FaPlayCircle className="me-2 text-danger" />Property Videos
                                            </h4>
                                            <div className="row g-3">
                                                {property.videos.map((video, index) => (
                                                    <motion.div
                                                        key={video.id}
                                                        className="col-md-4 col-sm-6"
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: index * 0.1 }}
                                                    >
                                                        <div className="position-relative overflow-hidden rounded bg-dark" style={{ height: '200px' }}>
                                                            <a
                                                                href={video.video}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="d-flex align-items-center justify-content-center h-100 text-decoration-none position-relative"
                                                                style={{ backgroundColor: '#000' }}
                                                            >
                                                                <FaPlayCircle className="text-white fa-3x" style={{ opacity: 0.7 }} />
                                                            </a>
                                                        </div>
                                                        <p className="text-center mt-2 mb-0 small fw-bold">
                                                            <a href={video.video} target="_blank" rel="noopener noreferrer" className="link-primary text-decoration-none">
                                                                Watch Video {index + 1}
                                                            </a>
                                                        </p>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Features */}
                                <div className="card border-0 shadow-sm">
                                    <div className="card-body">
                                        <h4 className="fw-bold mb-3">Features</h4>
                                        <div className="row">
                                            {property.has_parking && (
                                                <div className="col-md-6 mb-2">
                                                    <FaCheckCircle className="text-success me-2" />Parking
                                                </div>
                                            )}
                                            {property.has_garden && (
                                                <div className="col-md-6 mb-2">
                                                    <FaCheckCircle className="text-success me-2" />Garden
                                                </div>
                                            )}
                                            {property.has_balcony && (
                                                <div className="col-md-6 mb-2">
                                                    <FaCheckCircle className="text-success me-2" />Balcony
                                                </div>
                                            )}
                                            {property.has_pool && (
                                                <div className="col-md-6 mb-2">
                                                    <FaCheckCircle className="text-success me-2" />Swimming Pool
                                                </div>
                                            )}
                                            {property.has_gym && (
                                                <div className="col-md-6 mb-2">
                                                    <FaCheckCircle className="text-success me-2" />Gym
                                                </div>
                                            )}
                                            {property.has_security && (
                                                <div className="col-md-6 mb-2">
                                                    <FaCheckCircle className="text-success me-2" />Security
                                                </div>
                                            )}
                                            {property.is_furnished && (
                                                <div className="col-md-6 mb-2">
                                                    <FaCheckCircle className="text-success me-2" />Furnished
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Sidebar */}
                        <div className="col-lg-4">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="card border-0 shadow-sm sticky-top" style={{ top: '20px' }}>
                                    <div className="card-body">
                                        <h5 className="fw-bold mb-3">Contact Host</h5>
                                        <div className="mb-3">
                                            <p className="mb-1">
                                                <FaUser className="me-2 text-primary" />
                                                <strong>{property.host_name}</strong>
                                            </p>
                                            <p className="mb-0 text-muted small">
                                                <FaEnvelope className="me-2" />
                                                {property.host_email}
                                            </p>
                                        </div>
                                        <Link 
                                            to={`/messaging/?property_id=${property.id}&property_title=${encodeURIComponent(property.title)}`}
                                            className="btn btn-success w-100 mb-2 fw-bold"
                                        >
                                            ✓ I'm Interested
                                        </Link>
                                        <Link to="/messaging/" className="btn btn-primary w-100 mb-2">
                                            Send Message
                                        </Link>
                                        {isOwner && (
                                            <Link to={`/properties/${property.id}/edit/`} className="btn btn-warning w-100 mb-2">
                                                ✏️ Edit Property
                                            </Link>
                                        )}
                                        <Link to="/properties/" className="btn btn-outline-secondary w-100">
                                            Back to Listings
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </>
            </div>
        </div>
    );
};

export default PropertyDetail;
