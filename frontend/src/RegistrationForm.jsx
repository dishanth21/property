import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaHome, FaShoppingBag } from 'react-icons/fa';
import SuccessModal from './SuccessModal';

const RegistrationForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        phone: '',
        is_host: false,
        is_buyer: true
    });
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setFieldErrors({});
        try {
            const response = await axios.post('http://127.0.0.1:8000/accounts/api/register/', formData);
            // Success - show modal
            setShowSuccessModal(true);
        } catch (err) {
            if (err.response?.data?.errors) {
                // Backend returned field-specific errors
                setFieldErrors(err.response.data.errors);
                setError(err.response.data.message || 'Please fix the errors below');
            } else {
                setError(err.response?.data?.message || err.response?.data?.error || 'Registration failed. Please check your inputs.');
            }
            console.error(err.response?.data);
        } finally {
            setLoading(false);
        }
    };

    const handleModalClose = () => {
        setShowSuccessModal(false);
        navigate('/accounts/login/');
    };

    return (
        <div className="row justify-content-center">
            <SuccessModal
                show={showSuccessModal}
                title="Registration Successful!"
                message="Your account has been created. Please login with your credentials."
                onClose={handleModalClose}
            />
            <div className="col-md-8 col-lg-6">
                <motion.div
                    className="card shadow-lg border-0 rounded-3 overflow-hidden"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="card-header bg-primary text-white text-center py-4">
                        <h3 className="fw-bold mb-0">Create Account</h3>
                        <p className="mb-0 opacity-75">Join our premium property network</p>
                    </div>
                    <div className="card-body p-5">
                        {error && (
                            <motion.div
                                className="alert alert-danger"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                <div className="col-md-12">
                                    <div className="input-group">
                                        <span className="input-group-text bg-light"><FaUser className="text-muted" /></span>
                                        <input type="text" className={`form-control ${fieldErrors.username ? 'is-invalid' : ''}`} name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
                                    </div>
                                    {fieldErrors.username && <small className="text-danger d-block mt-1">{fieldErrors.username}</small>}
                                </div>
                                <div className="col-md-12">
                                    <div className="input-group">
                                        <span className="input-group-text bg-light"><FaEnvelope className="text-muted" /></span>
                                        <input type="email" className={`form-control ${fieldErrors.email ? 'is-invalid' : ''}`} name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
                                    </div>
                                    {fieldErrors.email && <small className="text-danger d-block mt-1">{fieldErrors.email}</small>}
                                </div>
                                <div className="col-md-6">
                                    <input type="text" className="form-control" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} />
                                </div>
                                <div className="col-md-6">
                                    <input type="text" className="form-control" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} />
                                </div>
                                <div className="col-md-12">
                                    <div className="input-group">
                                        <span className="input-group-text bg-light"><FaPhone className="text-muted" /></span>
                                        <input type="text" className={`form-control ${fieldErrors.phone ? 'is-invalid' : ''}`} name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
                                    </div>
                                    {fieldErrors.phone && <small className="text-danger d-block mt-1">{fieldErrors.phone}</small>}
                                </div>
                                <div className="col-md-12">
                                    <div className="input-group">
                                        <span className="input-group-text bg-light"><FaLock className="text-muted" /></span>
                                        <input type="password" className={`form-control ${fieldErrors.password ? 'is-invalid' : ''}`} name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                                    </div>
                                    {fieldErrors.password && <small className="text-danger d-block mt-1">{fieldErrors.password}</small>}
                                </div>

                                <div className="col-md-12 mt-3">
                                    <label className="form-label fw-bold text-muted small text-uppercase">I am interested in:</label>
                                    <div className="d-flex gap-3">
                                        <div className="form-check card p-3 flex-fill text-center border-primary-subtle">
                                            <input className="form-check-input float-none mb-2" type="checkbox" id="is_buyer" name="is_buyer" checked={formData.is_buyer} onChange={handleChange} />
                                            <label className="form-check-label d-block stretched-link" htmlFor="is_buyer">
                                                <FaShoppingBag className="d-block mx-auto mb-1 text-primary" /> Buying/Renting
                                            </label>
                                        </div>
                                        <div className="form-check card p-3 flex-fill text-center border-primary-subtle">
                                            <input className="form-check-input float-none mb-2" type="checkbox" id="is_host" name="is_host" checked={formData.is_host} onChange={handleChange} />
                                            <label className="form-check-label d-block stretched-link" htmlFor="is_host">
                                                <FaHome className="d-block mx-auto mb-1 text-primary" /> Listing Properties
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="d-grid mt-4">
                                <motion.button
                                    type="submit"
                                    className="btn btn-primary btn-lg"
                                    disabled={loading}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {loading ? 'Creating Account...' : 'Register Now'}
                                </motion.button>
                            </div>
                        </form>
                        <div className="text-center mt-4">
                            <p className="mb-0 text-muted">Already have an account? <Link to="/accounts/login/" className="text-primary fw-bold text-decoration-none">Login here</Link></p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default RegistrationForm;
