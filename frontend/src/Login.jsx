import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';
import { useAuth } from './AuthContext';

// Helper function to get CSRF token
const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://127.0.0.1:8000/accounts/api/login/', formData, {
                withCredentials: true
            });
            
            // Update auth context with user data and token
            login(response.data.user, response.data.token);
            
            // Redirect to home page after successful login
            navigate('/');
        } catch (err) {
            console.error('Login error details:', {
                status: err.response?.status,
                data: err.response?.data,
                message: err.message
            });
            setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
                <motion.div
                    className="card shadow-lg border-0 rounded-3 overflow-hidden"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="card-header bg-primary text-white text-center py-4">
                        <h3 className="fw-bold mb-0">Welcome Back</h3>
                        <p className="mb-0 opacity-75">Login to your account</p>
                    </div>
                    <div className="card-body p-5">
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
                                <div className="input-group input-group-lg">
                                    <span className="input-group-text bg-light"><FaUser className="text-muted" /></span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="username"
                                        placeholder="Username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <div className="input-group input-group-lg">
                                    <span className="input-group-text bg-light"><FaLock className="text-muted" /></span>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="d-grid">
                                <motion.button
                                    type="submit"
                                    className="btn btn-primary btn-lg"
                                    disabled={loading}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {loading ? 'Logging In...' : (
                                        <>
                                            <FaSignInAlt className="me-2" /> Login
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </form>

                        <div className="text-center mt-4">
                            <p className="mb-2"><Link to="/accounts/password_reset/" className="text-decoration-none text-muted">Forgot Password?</Link></p>
                            <p className="mb-0 text-muted">Don't have an account? <Link to="/accounts/register/" className="text-primary fw-bold text-decoration-none">Register here</Link></p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
