import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaTachometerAlt, FaHome, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const { user } = useAuth();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user?.is_host) {
            fetchUserProperties();
        }
    }, [user]);

    const fetchUserProperties = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get('http://127.0.0.1:8000/properties/api/my-properties/', {
                headers: token ? { 'Authorization': `Token ${token}` } : {},
                withCredentials: true
            });
            setProperties(response.data);
        } catch (error) {
            console.error('Error fetching properties:', error);
        } finally {
            setLoading(false);
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

    if (!user) {
        return (
            <div className="text-center py-5">
                <h2>Please login to view your dashboard</h2>
                <Link to="/accounts/login/" className="btn btn-primary mt-3">Login</Link>
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
                <h1 className="fw-bold mb-4">Dashboard</h1>

                <div className="row g-4 mb-4">
                    {/* User Info Card */}
                    <div className="col-md-12">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title fw-bold mb-3">
                                    <FaUser className="me-2 text-primary" />
                                    Profile Information
                                </h5>
                                <div className="row">
                                    <div className="col-md-6">
                                        <p><strong>Username:</strong> {user.username}</p>
                                        <p><strong>Email:</strong> {user.email}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <p><strong>Account Type:</strong> {user.is_host && user.is_buyer ? 'Host & Buyer' : user.is_host ? 'Host' : 'Buyer'}</p>
                                        <p><strong>Status:</strong> <span className="badge bg-success">Active</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="row g-4 mb-4">
                    {user.is_host && (
                        <div className="col-md-4">
                            <Link to="/properties/add/" className="text-decoration-none">
                                <motion.div
                                    className="card border-0 shadow-sm h-100 bg-primary text-white"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="card-body text-center p-4">
                                        <FaHome className="fa-3x mb-3" />
                                        <h5 className="fw-bold">Add Property</h5>
                                        <p className="mb-0">List a new property</p>
                                    </div>
                                </motion.div>
                            </Link>
                        </div>
                    )}

                    <div className="col-md-4">
                        <Link to="/properties/" className="text-decoration-none">
                            <motion.div
                                className="card border-0 shadow-sm h-100"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="card-body text-center p-4">
                                    <FaHome className="text-primary fa-3x mb-3" />
                                    <h5 className="fw-bold">Browse Properties</h5>
                                    <p className="text-muted">Explore available properties</p>
                                </div>
                            </motion.div>
                        </Link>
                    </div>

                    <div className="col-md-4">
                        <Link to="/messaging/" className="text-decoration-none">
                            <motion.div
                                className="card border-0 shadow-sm h-100"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="card-body text-center p-4">
                                    <FaEnvelope className="text-success fa-3x mb-3" />
                                    <h5 className="fw-bold">Messages</h5>
                                    <p className="text-muted">View your conversations</p>
                                </div>
                            </motion.div>
                        </Link>
                    </div>
                </div>

                {/* Admin Dashboard Link */}
                {user.is_admin && (
                    <div className="row mb-4">
                        <div className="col-12">
                            <Link to="/admin/" className="text-decoration-none">
                                <motion.div
                                    className="card border-0 shadow-sm bg-danger text-white"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="card-body text-center p-3">
                                        <h5 className="mb-0">📋 Go to Admin Panel</h5>
                                    </div>
                                </motion.div>
                            </Link>
                        </div>
                    </div>
                )}

                {/* My Properties Section */}
                {user.is_host && (
                    <div className="row mt-5">
                        <div className="col-12">
                            <div className="card border-0 shadow-sm">
                                <div className="card-header bg-primary text-white">
                                    <h5 className="mb-0">My Properties</h5>
                                </div>
                                <div className="card-body">
                                    {loading ? (
                                        <div className="text-center py-4">
                                            <div className="spinner-border" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                    ) : properties.length === 0 ? (
                                        <div className="text-center py-4">
                                            <p className="text-muted">You haven't listed any properties yet.</p>
                                            <Link to="/properties/add/" className="btn btn-primary">Add Your First Property</Link>
                                        </div>
                                    ) : (
                                        <div className="table-responsive">
                                            <table className="table table-hover">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>Title</th>
                                                        <th>City</th>
                                                        <th>Price</th>
                                                        <th>Status</th>
                                                        <th>Created</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {properties.map((property) => (
                                                        <tr key={property.id}>
                                                            <td className="fw-bold">{property.title}</td>
                                                            <td>{property.city}, {property.state}</td>
                                                            <td>₹{property.price.toLocaleString()}</td>
                                                            <td>{getStatusBadge(property.approval_status)}</td>
                                                            <td>{new Date(property.created).toLocaleDateString()}</td>
                                                            <td>
                                                                <Link to={`/properties/${property.id}/`} className="btn btn-sm btn-primary me-2">
                                                                    View
                                                                </Link>
                                                                <Link to={`/properties/${property.id}/edit/`} className="btn btn-sm btn-warning">
                                                                    Edit
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Dashboard;
