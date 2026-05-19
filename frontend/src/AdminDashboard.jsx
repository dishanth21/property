import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaClock, FaArrowLeft, FaChevronLeft, FaChevronRight, FaPlayCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from './AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SuccessModal from './SuccessModal';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [rejectionReason, setRejectionReason] = useState({});
    const [showRejectForm, setShowRejectForm] = useState({});
    const [currentImageIndex, setCurrentImageIndex] = useState({});
    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const [showRejectionModal, setShowRejectionModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        if (!user || !user.is_admin) {
            navigate('/');
            return;
        }
        fetchAllProperties();
    }, [user, navigate]);

    const fetchAllProperties = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                alert('No authentication token. Please login again.');
                navigate('/login');
                return;
            }
            
            const response = await axios.get('http://127.0.0.1:8000/properties/api/admin/properties/', {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            setProperties(Array.isArray(response.data) ? response.data : response.data.results || []);
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.response?.statusText || error.message;
            alert(`Failed to load properties: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (propertyId) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post(
                `http://127.0.0.1:8000/properties/api/admin/${propertyId}/approve/`,
                {},
                {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                }
            );
            setModalMessage('Property has been approved successfully and is now visible to buyers.');
            setShowApprovalModal(true);
            setTimeout(() => {
                fetchAllProperties();
            }, 1500);
        } catch (error) {
            console.error('Error approving property:', error);
            alert('Failed to approve property');
        }
    };

    const handleReject = async (propertyId) => {
        const reason = rejectionReason[propertyId] || '';
        if (!reason.trim()) {
            alert('Please provide a reason for rejection');
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post(
                `http://127.0.0.1:8000/properties/api/admin/${propertyId}/reject/`,
                { reason: reason },
                {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                }
            );
            setModalMessage('Property has been rejected. The host will see the reason in their dashboard.');
            setShowRejectionModal(true);
            setRejectionReason(prev => ({...prev, [propertyId]: ''}));
            setShowRejectForm(prev => ({...prev, [propertyId]: false}));
            setTimeout(() => {
                fetchAllProperties();
            }, 1500);
        } catch (error) {
            console.error('Error rejecting property:', error);
            alert('Failed to reject property');
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return <span className="badge bg-success"><FaCheckCircle className="me-1" />Approved</span>;
            case 'pending':
                return <span className="badge bg-warning"><FaClock className="me-1" />Pending</span>;
            case 'rejected':
                return <span className="badge bg-danger"><FaTimesCircle className="me-1" />Rejected</span>;
            default:
                return <span className="badge bg-secondary">Unknown</span>;
        }
    };

    const pendingProperties = properties.filter(p => p.approval_status === 'pending');
    const approvedProperties = properties.filter(p => p.approval_status === 'approved');
    const rejectedProperties = properties.filter(p => p.approval_status === 'rejected');

    if (!user || !user.is_admin) {
        return (
            <div className="text-center py-5">
                <h2>Access Denied</h2>
                <p>You don't have permission to access this page.</p>
                <Link to="/" className="btn btn-primary mt-3">Go Home</Link>
            </div>
        );
    }

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="d-flex align-items-center mb-4">
                    <Link to="/dashboard/" className="btn btn-outline-secondary me-3">
                        <FaArrowLeft className="me-2" />Back to Dashboard
                    </Link>
                    <h1 className="fw-bold mb-0">Admin Dashboard - Property Approvals</h1>
                </div>

                {/* Stats */}
                <div className="row g-3 mb-4">
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm bg-warning bg-opacity-10">
                            <div className="card-body text-center">
                                <h3 className="text-warning">{pendingProperties.length}</h3>
                                <p className="text-muted mb-0">Pending Approval</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm bg-success bg-opacity-10">
                            <div className="card-body text-center">
                                <h3 className="text-success">{approvedProperties.length}</h3>
                                <p className="text-muted mb-0">Approved</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm bg-danger bg-opacity-10">
                            <div className="card-body text-center">
                                <h3 className="text-danger">{rejectedProperties.length}</h3>
                                <p className="text-muted mb-0">Rejected</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pending Properties */}
                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-header bg-warning text-dark fw-bold">
                        <FaClock className="me-2" />Pending Approval ({pendingProperties.length})
                    </div>
                    <div className="card-body">
                        {loading ? (
                            <div className="text-center py-4">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : pendingProperties.length === 0 ? (
                            <div className="text-center py-4 text-muted">
                                No pending properties
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {pendingProperties.map((property) => (
                                    <div key={property.id} className="border rounded p-3 mb-3">
                                        <div className="row">
                                            {/* Property Images Carousel */}
                                            <div className="col-md-4">
                                                {property.images && property.images.length > 0 ? (
                                                    <div style={{ position: 'relative' }}>
                                                        <img
                                                            src={property.images[currentImageIndex[property.id] || 0]?.image}
                                                            alt={property.title}
                                                            className="img-fluid rounded"
                                                            style={{ height: '200px', objectFit: 'cover', width: '100%' }}
                                                        />
                                                        {property.images.length > 1 && (
                                                            <>
                                                                <motion.button
                                                                    className="btn btn-sm btn-light position-absolute start-0 top-50 translate-middle-y"
                                                                    onClick={() => setCurrentImageIndex(prev => ({...prev, [property.id]: (prev[property.id] || 0) === 0 ? property.images.length - 1 : (prev[property.id] || 0) - 1}))}
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                >
                                                                    <FaChevronLeft />
                                                                </motion.button>
                                                                <motion.button
                                                                    className="btn btn-sm btn-light position-absolute end-0 top-50 translate-middle-y"
                                                                    onClick={() => setCurrentImageIndex(prev => ({...prev, [property.id]: ((prev[property.id] || 0) + 1) % property.images.length}))}
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                >
                                                                    <FaChevronRight />
                                                                </motion.button>
                                                                <div className="position-absolute bottom-0 end-0 bg-dark bg-opacity-50 text-white px-2 py-1 rounded-start" style={{ fontSize: '0.85rem' }}>
                                                                    {(currentImageIndex[property.id] || 0) + 1}/{property.images.length}
                                                                </div>
                                                            </>
                                                        )}
                                                        {/* Thumbnail Gallery */}
                                                        <div className="mt-2" style={{ display: 'flex', gap: '5px', overflowX: 'auto' }}>
                                                            {property.images.map((img, idx) => (
                                                                <img
                                                                    key={idx}
                                                                    src={img.image}
                                                                    alt={`Thumb ${idx}`}
                                                                    style={{
                                                                        height: '50px',
                                                                        width: '50px',
                                                                        objectFit: 'cover',
                                                                        cursor: 'pointer',
                                                                        borderRadius: '4px',
                                                                        border: (currentImageIndex[property.id] || 0) === idx ? '2px solid #007bff' : '1px solid #ddd',
                                                                        opacity: (currentImageIndex[property.id] || 0) === idx ? 1 : 0.6
                                                                    }}
                                                                    onClick={() => setCurrentImageIndex(prev => ({...prev, [property.id]: idx}))}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
                                                        <span className="text-muted">No images</span>
                                                    </div>
                                                )}
                                                {/* Videos Section */}
                                                {property.videos && property.videos.length > 0 && (
                                                    <div className="mt-3">
                                                        <p className="mb-2 fw-bold text-primary">
                                                            <FaPlayCircle className="me-2" />Videos ({property.videos.length})
                                                        </p>
                                                        {property.videos.map((video, idx) => (
                                                            <a
                                                                key={idx}
                                                                href={video.video}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="btn btn-outline-primary btn-sm w-100 mb-2"
                                                            >
                                                                <FaPlayCircle className="me-2" />View Video {idx + 1}
                                                            </a>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-md-4">
                                                <h5 className="fw-bold mb-2">{property.title}</h5>
                                                <p className="text-muted mb-1">
                                                    <strong>Host:</strong> {property.host_name} ({property.host_email})
                                                </p>
                                                <p className="text-muted mb-1">
                                                    <strong>Phone:</strong> {property.host_phone || 'N/A'}
                                                </p>
                                                <p className="text-muted mb-1">
                                                    <strong>Location:</strong> {property.address}, {property.city}, {property.state} {property.zip_code}
                                                </p>
                                                <p className="text-muted mb-1">
                                                    <strong>Price:</strong> ₹{Number(property.price).toLocaleString()} | 
                                                    <strong className="ms-2">Type:</strong> {property.property_type} | 
                                                    <strong className="ms-2">Bedrooms:</strong> {property.bedrooms}
                                                </p>
                                                <p className="text-muted text-truncate">
                                                    <strong>Description:</strong> {property.description.substring(0, 80)}...
                                                </p>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="d-flex gap-2 mb-3">
                                                    <motion.button
                                                        className="btn btn-success btn-sm flex-fill"
                                                        onClick={() => handleApprove(property.id)}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <FaCheckCircle className="me-1" />Approve
                                                    </motion.button>
                                                    <motion.button
                                                        className="btn btn-danger btn-sm flex-fill"
                                                        onClick={() => setShowRejectForm(prev => ({...prev, [property.id]: !prev[property.id]}))}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <FaTimesCircle className="me-1" />Reject
                                                    </motion.button>
                                                </div>
                                                {showRejectForm[property.id] && (
                                                    <div className="mt-3 pt-3 border-top">
                                                        <textarea
                                                            className="form-control form-control-sm mb-2"
                                                            placeholder="Reason for rejection"
                                                            rows="3"
                                                            value={rejectionReason[property.id] || ''}
                                                            onChange={(e) => setRejectionReason(prev => ({...prev, [property.id]: e.target.value}))}
                                                        ></textarea>
                                                        <motion.button
                                                            className="btn btn-danger btn-sm w-100"
                                                            onClick={() => handleReject(property.id)}
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            Confirm Rejection
                                                        </motion.button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Approved Properties */}
                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-header bg-success text-white fw-bold">
                        <FaCheckCircle className="me-2" />Approved ({approvedProperties.length})
                    </div>
                    <div className="card-body">
                        {approvedProperties.length === 0 ? (
                            <div className="text-center py-4 text-muted">
                                No approved properties
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Title</th>
                                            <th>Host</th>
                                            <th>Price</th>
                                            <th>Type</th>
                                            <th>Approved On</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {approvedProperties.map((property) => (
                                            <tr key={property.id}>
                                                <td className="fw-bold">{property.title}</td>
                                                <td>{property.host_name}</td>
                                                <td>₹{property.price.toLocaleString()}</td>
                                                <td>{property.property_type}</td>
                                                <td>{property.approval_date ? new Date(property.approval_date).toLocaleDateString() : '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Rejected Properties */}
                <div className="card border-0 shadow-sm">
                    <div className="card-header bg-danger text-white fw-bold">
                        <FaTimesCircle className="me-2" />Rejected ({rejectedProperties.length})
                    </div>
                    <div className="card-body">
                        {rejectedProperties.length === 0 ? (
                            <div className="text-center py-4 text-muted">
                                No rejected properties
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Title</th>
                                            <th>Host</th>
                                            <th>Price</th>
                                            <th>Type</th>
                                            <th>Reason</th>
                                            <th>Rejected On</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rejectedProperties.map((property) => (
                                            <tr key={property.id}>
                                                <td className="fw-bold">{property.title}</td>
                                                <td>{property.host_name}</td>
                                                <td>₹{property.price.toLocaleString()}</td>
                                                <td>{property.property_type}</td>
                                                <td>{property.rejection_reason || '-'}</td>
                                                <td>{property.approval_date ? new Date(property.approval_date).toLocaleDateString() : '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Approval Success Modal */}
            {showApprovalModal && (
                <SuccessModal
                    title="Property Approved!"
                    message={modalMessage}
                    onClose={() => setShowApprovalModal(false)}
                />
            )}

            {/* Rejection Success Modal */}
            {showRejectionModal && (
                <SuccessModal
                    title="Property Rejected"
                    message={modalMessage}
                    onClose={() => setShowRejectionModal(false)}
                />
            )}
        </div>
    );
};

export default AdminDashboard;