import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';

const PropertyList = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        listingType: 'all',
        priceMin: '',
        priceMax: '',
        city: ''
    });

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/properties/api/');
            setProperties(response.data);
        } catch (error) {
            console.error('Error fetching properties:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProperties = properties.filter(property => {
        const matchSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.city.toLowerCase().includes(searchTerm.toLowerCase());
        const matchListing = filters.listingType === 'all' || property.listing_type === filters.listingType;
        const matchCity = !filters.city || property.city.toLowerCase().includes(filters.city.toLowerCase());
        const matchPrice = (!filters.priceMin || property.price >= parseInt(filters.priceMin)) &&
                          (!filters.priceMax || property.price <= parseInt(filters.priceMax));
        
        return matchSearch && matchListing && matchCity && matchPrice;
    });

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Search & Filter Header */}
            <div className="bg-light py-4 mb-4">
                <div className="container">
                    <h1 className="fw-bold mb-3">Browse Properties</h1>
                    <div className="input-group input-group-lg mb-3">
                        <span className="input-group-text bg-white">
                            <FaSearch className="text-muted" />
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by title or city..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    {/* Filter Section */}
                    <div className="row g-3">
                        <div className="col-md-3">
                            <label className="form-label small fw-bold">Listing Type</label>
                            <select 
                                className="form-select"
                                value={filters.listingType}
                                onChange={(e) => setFilters({...filters, listingType: e.target.value})}
                            >
                                <option value="all">All Types</option>
                                <option value="sale">For Sale</option>
                                <option value="rent">For Rent</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small fw-bold">City</label>
                            <input 
                                type="text"
                                className="form-control"
                                placeholder="Filter by city"
                                value={filters.city}
                                onChange={(e) => setFilters({...filters, city: e.target.value})}
                            />
                        </div>
                        <div className="col-md-2">
                            <label className="form-label small fw-bold">Min Price (₹)</label>
                            <input 
                                type="number"
                                className="form-control"
                                placeholder="Min"
                                value={filters.priceMin}
                                onChange={(e) => setFilters({...filters, priceMin: e.target.value})}
                            />
                        </div>
                        <div className="col-md-2">
                            <label className="form-label small fw-bold">Max Price (₹)</label>
                            <input 
                                type="number"
                                className="form-control"
                                placeholder="Max"
                                value={filters.priceMax}
                                onChange={(e) => setFilters({...filters, priceMax: e.target.value})}
                            />
                        </div>
                        <div className="col-md-2">
                            <label className="form-label small fw-bold">&nbsp;</label>
                            <button 
                                className="btn btn-outline-secondary w-100"
                                onClick={() => setFilters({listingType: 'all', priceMin: '', priceMax: '', city: ''})}
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Property Grid */}
            <div className="container">
                {filteredProperties.length === 0 ? (
                    <div className="text-center py-5">
                        <p className="text-muted">No properties found.</p>
                    </div>
                ) : (
                    <div className="row g-4">
                        {filteredProperties.map((property, index) => (
                            <motion.div
                                key={property.id}
                                className="col-md-6 col-lg-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link to={`/properties/${property.id}/`} className="text-decoration-none">
                                    <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
                                        {property.primary_image && (
                                            <img
                                                src={property.primary_image}
                                                className="card-img-top"
                                                alt={property.title}
                                                style={{ height: '200px', objectFit: 'cover' }}
                                            />
                                        )}
                                        {!property.primary_image && (
                                            <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
                                                <FaMapMarkerAlt className="text-muted fa-3x" />
                                            </div>
                                        )}
                                        <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                                <h5 className="card-title text-dark mb-0">{property.title}</h5>
                                                <div className="d-flex gap-2">
                                                    {property.is_featured && (
                                                        <span className="badge bg-warning text-dark">Featured</span>
                                                    )}
                                                    <span className={`badge ${property.listing_type === 'rent' ? 'bg-info' : 'bg-success'}`}>
                                                        {property.listing_type === 'rent' ? 'Rent' : 'Sale'}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-muted small mb-2">
                                                <FaMapMarkerAlt className="me-1" />
                                                {property.city}, {property.state}
                                            </p>
                                            <div className="d-flex gap-3 mb-3 text-muted small">
                                                {property.bedrooms > 0 && (
                                                    <span><FaBed className="me-1" />{property.bedrooms} Beds</span>
                                                )}
                                                {property.bathrooms > 0 && (
                                                    <span><FaBath className="me-1" />{property.bathrooms} Baths</span>
                                                )}
                                                {property.sqft && (
                                                    <span><FaRulerCombined className="me-1" />{property.sqft} sqft</span>
                                                )}
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h4 className="text-primary mb-0">₹{Number(property.price).toLocaleString()}</h4>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PropertyList;
