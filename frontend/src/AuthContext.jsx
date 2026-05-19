import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Configure axios to always send credentials
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            // Check if token exists in localStorage
            const token = localStorage.getItem('authToken');
            
            if (token) {
                // Set the token in the Authorization header
                axios.defaults.headers.common['Authorization'] = `Token ${token}`;
                
                // Fetch user info to verify token is valid
                try {
                    const response = await axios.get('http://127.0.0.1:8000/accounts/api/user/');
                    setUser(response.data);
                } catch (apiError) {
                    // Token might be stale, clear it
                    localStorage.removeItem('authToken');
                    delete axios.defaults.headers.common['Authorization'];
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        } catch (error) {
            // Clear invalid token
            localStorage.removeItem('authToken');
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = (userData, token) => {
        // Store token in localStorage
        localStorage.setItem('authToken', token);
        // Set token in axios headers
        axios.defaults.headers.common['Authorization'] = `Token ${token}`;
        setUser(userData);
    };

    const logout = async () => {
        try {
            await axios.post('http://127.0.0.1:8000/accounts/api/logout/', {});
        } catch (error) {
            // Silently fail
        } finally {
            // Clear token and user state
            localStorage.removeItem('authToken');
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, checkAuthStatus }}>
            {children}
        </AuthContext.Provider>
    );
};
