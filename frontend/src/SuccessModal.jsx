import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';

const SuccessModal = ({ show, title, message, onClose }) => {
    // Handle both 'show' prop and direct rendering (when used in conditional)
    const isVisible = show !== undefined ? show : true;
    
    if (!isVisible) return null;

    return (
        <motion.div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-white rounded-3 shadow-lg p-5 text-center"
                style={{ maxWidth: '400px', width: '90%' }}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
                <motion.div
                    className="mb-3"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                >
                    <FaCheckCircle className="text-success" style={{ fontSize: '60px' }} />
                </motion.div>

                <h3 className="fw-bold text-dark mb-2">{title}</h3>
                <p className="text-muted mb-4">{message}</p>

                <motion.button
                    className="btn btn-primary btn-lg w-100"
                    onClick={onClose}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Continue
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

export default SuccessModal;
