import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaHome, FaKey, FaUserShield } from 'react-icons/fa';
import { useAuth } from './AuthContext';

const Home = () => {
    const { user } = useAuth();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.3 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero bg-primary text-white py-5 mb-5 position-relative overflow-hidden">
                <div className="container position-relative z-1">
                    <div className="row align-items-center min-vh-50">
                        <div className="col-lg-6 mb-4 mb-lg-0">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <h1 className="display-3 fw-bold mb-3">Find Your Dream Home</h1>
                                <p className="lead mb-4">Discover the perfect property with our immersive and easy-to-use platform.</p>
                                <div className="d-flex gap-3">
                                    <Link to="/properties/" className="btn btn-light btn-lg px-4 fw-bold text-primary shadow-sm">
                                        Browse Properties
                                    </Link>
                                    {!user && (
                                        <Link to="/accounts/register/" className="btn btn-outline-light btn-lg px-4 fw-bold">
                                            Join Now
                                        </Link>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                        <div className="col-lg-6 text-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <FaHome className="display-1 text-white opacity-50" style={{ fontSize: '15rem' }} />
                            </motion.div>
                        </div>
                    </div>
                </div>
                {/* Abstract Background Shapes */}
                <div className="position-absolute top-0 end-0 translate-middle-y bg-white opacity-10 rounded-circle" style={{ width: '300px', height: '300px', filter: 'blur(50px)' }}></div>
                <div className="position-absolute bottom-0 start-0 translate-middle-y bg-info opacity-20 rounded-circle" style={{ width: '400px', height: '400px', filter: 'blur(60px)' }}></div>
            </section>

            {/* Features Section */}
            <section className="container mb-5">
                <motion.div
                    className="row g-4"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <motion.div className="col-md-4" variants={itemVariants}>
                        <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
                            <div className="card-body text-center p-4">
                                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                                    <FaSearch className="text-primary fa-2x" />
                                </div>
                                <h3 className="h4 fw-bold">Easy Search</h3>
                                <p className="text-muted">Filter properties by location, price, and amenities to find exactly what you need.</p>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div className="col-md-4" variants={itemVariants}>
                        <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
                            <div className="card-body text-center p-4">
                                <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                                    <FaKey className="text-success fa-2x" />
                                </div>
                                <h3 className="h4 fw-bold">Secure Transactions</h3>
                                <p className="text-muted">Verified listings and secure communication channels for your peace of mind.</p>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div className="col-md-4" variants={itemVariants}>
                        <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
                            <div className="card-body text-center p-4">
                                <div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                                    <FaUserShield className="text-warning fa-2x" />
                                </div>
                                <h3 className="h4 fw-bold">Trusted Agents</h3>
                                <p className="text-muted">Connect with top-rated agents and hosts who are ready to assist you.</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Call to Action */}
            {!user && (
                <section className="bg-light py-5">
                    <div className="container text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="fw-bold mb-3">Ready to get started?</h2>
                            <p className="lead text-muted mb-4">Join thousands of satisfied users today.</p>
                            <Link to="/accounts/register/" className="btn btn-primary btn-lg px-5 shadow">Create Free Account</Link>
                        </motion.div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default Home;
