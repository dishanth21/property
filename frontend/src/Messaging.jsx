import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPaperPlane } from 'react-icons/fa';
import { useAuth } from './AuthContext';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import SuccessModal from './SuccessModal';

const Messaging = () => {
    const { user, checkAuthStatus } = useAuth();
    const [searchParams] = useSearchParams();
    const propertyIdParam = searchParams.get('property_id');
    const propertyTitleParam = searchParams.get('property_title');

    const [conversations, setConversations] = useState([]);
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showInitialModal, setShowInitialModal] = useState(false);
    const [initialMessage, setInitialMessage] = useState('');
    const [creatingEnquiry, setCreatingEnquiry] = useState(false);

    if (!user) {
        return (
            <div className="text-center py-5">
                <h2>Please login to access messaging</h2>
                <Link to="/login" className="btn btn-primary mt-3">Login</Link>
            </div>
        );
    }

    // Fetch all conversations
    useEffect(() => {
        fetchConversations();
        const interval = setInterval(fetchConversations, 3000);
        return () => clearInterval(interval);
    }, []);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('authToken');
        return token ? { 'Authorization': `Token ${token}` } : {};
    };

    // Show initial message modal if coming from property detail
    useEffect(() => {
        if (propertyIdParam && !selectedEnquiry) {
            setShowInitialModal(true);
        }
    }, [propertyIdParam]);

    const fetchConversations = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/messaging/api/enquiries/received/', {
                headers: getAuthHeaders()
            });
            setConversations(response.data);
        } catch (err) {
            console.error('Error fetching conversations:', err);
        }
    };

    const fetchEnquiryDetails = async (enquiryId) => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://127.0.0.1:8000/messaging/api/enquiries/${enquiryId}/detail/`,
                { headers: getAuthHeaders() }
            );
            setSelectedEnquiry(response.data);
            setMessages(response.data.messages);
            setError('');
        } catch (err) {
            setError('Error loading enquiry details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectEnquiry = (enquiry) => {
        fetchEnquiryDetails(enquiry.id);
    };

    const handleCreateEnquiry = async () => {
        if (!initialMessage.trim()) {
            setError('Please type a message');
            return;
        }

        try {
            setCreatingEnquiry(true);
            const response = await axios.post(
                'http://127.0.0.1:8000/messaging/api/enquiries/create_enquiry/',
                {
                    property_id: propertyIdParam,
                    message: initialMessage
                },
                { headers: getAuthHeaders() }
            );

            const enquiryData = response.data;
            setSuccess('Enquiry sent successfully! The host will respond soon.');
            setShowSuccessModal(true);
            setInitialMessage('');
            setShowInitialModal(false);

            // Fetch updated conversations
            setTimeout(() => {
                fetchConversations();
                setShowSuccessModal(false);
            }, 1500);
        } catch (err) {
            setError('Error creating enquiry: ' + (err.response?.data?.error || 'Unknown error'));
            console.error(err);
        } finally {
            setCreatingEnquiry(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!messageText.trim()) {
            setError('Message cannot be empty');
            return;
        }

        if (!selectedEnquiry) {
            setError('Please select a conversation');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(
                `http://127.0.0.1:8000/messaging/api/enquiries/${selectedEnquiry.id}/send_message/`,
                { content: messageText },
                { headers: getAuthHeaders() }
            );

            setMessages([...messages, response.data]);
            setMessageText('');
            setSuccess('Message sent successfully!');
            setShowSuccessModal(true);
            setError('');

            setTimeout(() => {
                fetchEnquiryDetails(selectedEnquiry.id);
                setShowSuccessModal(false);
            }, 1500);
        } catch (err) {
            setError('Error sending message: ' + (err.response?.data?.error || 'Unknown error'));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="fw-bold mb-4">
                    <FaEnvelope className="me-2" />
                    Messages
                </h1>

                <div className="row">
                    {/* Conversation List */}
                    <div className="col-md-4 mb-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-primary text-white">
                                <h5 className="mb-0">Conversations ({conversations.length})</h5>
                            </div>
                            <div className="card-body p-0">
                                {conversations.length === 0 ? (
                                    <p className="text-muted text-center py-4 mb-0">No conversations yet</p>
                                ) : (
                                    <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                                        {conversations.map((enquiry) => (
                                            <motion.div
                                                key={enquiry.id}
                                                onClick={() => handleSelectEnquiry(enquiry)}
                                                className={`p-3 border-bottom cursor-pointer ${
                                                    selectedEnquiry?.id === enquiry.id
                                                        ? 'bg-light border-left border-primary border-5'
                                                        : ''
                                                }`}
                                                style={{ cursor: 'pointer' }}
                                                whileHover={{ backgroundColor: '#f8f9fa' }}
                                            >
                                                <div className="d-flex justify-content-between">
                                                    <h6 className="mb-1 fw-bold">{enquiry.property_title}</h6>
                                                    <span className={`badge bg-${
                                                        enquiry.status === 'new' ? 'danger' :
                                                        enquiry.status === 'replied' ? 'success' : 'secondary'
                                                    }`}>
                                                        {enquiry.status.toUpperCase()}
                                                    </span>
                                                </div>
                                                <p className="text-muted small mb-1">
                                                    From: {enquiry.sender_username}
                                                </p>
                                                <p className="text-truncate small text-dark mb-0">
                                                    {enquiry.message}
                                                </p>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Message Thread */}
                    <div className="col-md-8">
                        <div className="card border-0 shadow-sm h-100">
                            {selectedEnquiry ? (
                                <div className="d-flex flex-column h-100">
                                    {/* Header */}
                                    <div className="card-header bg-light border-bottom">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h5 className="mb-1">{selectedEnquiry.property_title}</h5>
                                                <p className="text-muted small mb-0">
                                                    From: <strong>{selectedEnquiry.sender_detail.username}</strong>
                                                </p>
                                            </div>
                                            <span className={`badge bg-${
                                                selectedEnquiry.status === 'new' ? 'danger' :
                                                selectedEnquiry.status === 'replied' ? 'success' : 'secondary'
                                            }`}>
                                                {selectedEnquiry.status.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Messages Area */}
                                    <div className="flex-grow-1" style={{ minHeight: '350px', overflowY: 'auto', backgroundColor: '#f9f9f9', padding: '20px' }}>
                                        {error && (
                                            <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                                {error}
                                                <button type="button" className="btn-close" onClick={() => setError('')}></button>
                                            </div>
                                        )}
                                        
                                        {/* Original Enquiry */}
                                        <div className="mb-3">
                                            <div className={`p-3 rounded shadow-sm ${
                                                selectedEnquiry.sender.id === user.id
                                                    ? 'bg-primary text-white ms-auto'
                                                    : 'bg-white'
                                            }`} style={{ maxWidth: '85%' }}>
                                                <p className="small mb-1">
                                                    <strong>{selectedEnquiry.sender_detail.username}</strong>
                                                </p>
                                                <p className="mb-2">{selectedEnquiry.message}</p>
                                                <small className={selectedEnquiry.sender.id === user.id ? 'text-light' : 'text-muted'}>
                                                    {new Date(selectedEnquiry.created).toLocaleString()}
                                                </small>
                                            </div>
                                        </div>

                                        <hr className="my-3" />

                                        {/* Reply Messages */}
                                        {messages.length === 0 ? (
                                            <p className="text-muted text-center py-3">No replies yet. Be the first to reply!</p>
                                        ) : (
                                            messages.map((msg) => (
                                                <motion.div
                                                    key={msg.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="mb-3"
                                                >
                                                    <div className={`p-3 rounded shadow-sm ${
                                                        msg.sender.id === user.id
                                                            ? 'bg-primary text-white ms-auto'
                                                            : 'bg-white'
                                                    }`} style={{ maxWidth: '85%' }}>
                                                        <p className="small mb-1">
                                                            <strong>{msg.sender_username}</strong>
                                                        </p>
                                                        <p className="mb-2">{msg.content}</p>
                                                        <small className={msg.sender.id === user.id ? 'text-light' : 'text-muted'}>
                                                            {new Date(msg.created).toLocaleString()}
                                                        </small>
                                                    </div>
                                                </motion.div>
                                            ))
                                        )}
                                    </div>

                                    {/* Input Area - ALWAYS VISIBLE */}
                                    <div className="card-footer bg-white border-top p-3">
                                        <form onSubmit={handleSendMessage}>
                                            <label className="form-label fw-bold d-flex align-items-center gap-2 mb-2">
                                                <FaPaperPlane /> Type Your Reply
                                            </label>
                                            <textarea
                                                className="form-control mb-2"
                                                rows="3"
                                                placeholder="Type your message here..."
                                                value={messageText}
                                                onChange={(e) => setMessageText(e.target.value)}
                                                disabled={loading}
                                                style={{ minHeight: '80px' }}
                                            ></textarea>
                                            <motion.button
                                                type="submit"
                                                className="btn btn-primary w-100"
                                                disabled={loading || !messageText.trim()}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <FaPaperPlane className="me-2" /> 
                                                {loading ? 'Sending...' : 'Send Message'}
                                            </motion.button>
                                        </form>
                                    </div>
                                </div>
                            ) : (
                                <div className="card-body text-center py-5">
                                    <FaEnvelope className="text-muted" style={{ fontSize: '3rem' }} />
                                    <p className="text-muted mt-3">Select a conversation to view messages</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Initial Enquiry Modal */}
            {showInitialModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">
                                    <FaEnvelope className="me-2" />
                                    Send Enquiry - {propertyTitleParam}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowInitialModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {error && (
                                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                        {error}
                                        <button type="button" className="btn-close" onClick={() => setError('')}></button>
                                    </div>
                                )}
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Your Message</label>
                                    <textarea
                                        className="form-control"
                                        rows="5"
                                        placeholder="Tell the host why you're interested in this property..."
                                        value={initialMessage}
                                        onChange={(e) => setInitialMessage(e.target.value)}
                                        disabled={creatingEnquiry}
                                    ></textarea>
                                    <small className="text-muted d-block mt-2">
                                        {initialMessage.length} characters
                                    </small>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowInitialModal(false)}
                                    disabled={creatingEnquiry}
                                >
                                    Cancel
                                </button>
                                <motion.button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleCreateEnquiry}
                                    disabled={creatingEnquiry || !initialMessage.trim()}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <FaPaperPlane className="me-2" />
                                    {creatingEnquiry ? 'Sending...' : 'Send Enquiry'}
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            <SuccessModal
                show={showSuccessModal}
                message={success}
                title="Success"
            />
        </div>
    );
};

export default Messaging;
