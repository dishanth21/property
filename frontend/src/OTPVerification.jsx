import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShieldAlt } from 'react-icons/fa';

const OTPVerification = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('http://127.0.0.1:8000/accounts/api/verify-otp/', { otp });
            // Redirect to dashboard or home
            window.location.href = response.data.redirect_url || '/properties/';
        } catch (err) {
            setError(err.response?.data?.error || 'Verification failed. Invalid OTP.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
                <motion.div
                    className="card shadow-lg border-0 rounded-3"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="card-body p-5 text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        >
                            <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-4 mb-4">
                                <FaShieldAlt className="text-primary fa-3x" />
                            </div>
                        </motion.div>

                        <h3 className="fw-bold mb-2">Verify Account</h3>
                        <p className="text-muted mb-4">Enter the 6-digit code sent to your email</p>

                        {error && (
                            <motion.div
                                className="alert alert-danger"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    className="form-control form-control-lg text-center fw-bold"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength="6"
                                    placeholder="• • • • • •"
                                    required
                                    style={{ letterSpacing: '10px', fontSize: '1.5rem' }}
                                />
                            </div>

                            <div className="d-grid">
                                <motion.button
                                    type="submit"
                                    className="btn btn-primary btn-lg"
                                    disabled={loading}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {loading ? 'Verifying...' : 'Verify & Login'}
                                </motion.button>
                            </div>
                        </form>

                        <div className="mt-4">
                            <button className="btn btn-link text-muted text-decoration-none btn-sm">Resend Code</button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default OTPVerification;
