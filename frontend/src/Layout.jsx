import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaSignInAlt, FaUserPlus, FaUser, FaSignOutAlt, FaTachometerAlt, FaEnvelope } from 'react-icons/fa';
import { useAuth } from './AuthContext';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await logout();
        navigate('/');
    };

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
                <div className="container">
                    <Link className="navbar-brand d-flex align-items-center fw-bold" to="/">
                        <FaHome className="me-2" /> PropertyPortal
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            {user ? (
                                <>
                                    <li className="nav-item dropdown">
                                        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <FaUser className="me-1" /> {user.username}
                                        </a>
                                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                            <li>
                                                <Link className="dropdown-item" to="/dashboard/">
                                                    <FaTachometerAlt className="me-2" /> Dashboard
                                                </Link>
                                            </li>
                                            {user.is_admin && (
                                                <li>
                                                    <Link className="dropdown-item" to="/admin/">
                                                        🔐 Admin Panel
                                                    </Link>
                                                </li>
                                            )}
                                            <li>
                                                <Link className="dropdown-item" to="/messaging/">
                                                    <FaEnvelope className="me-2" /> Messages
                                                </Link>
                                            </li>
                                            <li><hr className="dropdown-divider" /></li>
                                            <li>
                                                <button
                                                    className="dropdown-item"
                                                    onClick={handleLogout}
                                                >
                                                    <FaSignOutAlt className="me-2" /> Logout
                                                </button>
                                            </li>
                                        </ul>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link d-flex align-items-center" to="/accounts/login/">
                                            <FaSignInAlt className="me-1" /> Login
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link d-flex align-items-center" to="/accounts/register/">
                                            <FaUserPlus className="me-1" /> Register
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Main Content with Animation */}
            <main className="flex-grow-1 container py-5">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <Outlet />
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="bg-dark text-white py-4 mt-auto">
                <div className="container text-center">
                    <p className="mb-0">&copy; {new Date().getFullYear()} PropertyPortal. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
