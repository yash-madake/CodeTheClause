// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // You might want to verify the token with the backend here
            // For now, we'll just decode it
            const user = JSON.parse(atob(token.split('.')[1]));
            setCurrentUser(user);
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        console.log('Logging in with:', credentials);
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, credentials);
            console.log('Login response:', res.data);
            const { token } = res.data;
            localStorage.setItem('token', token);
            const user = JSON.parse(atob(token.split('.')[1]));
            setCurrentUser(user);

            // Route based on role
            switch (user.role) {
                case 'senior':
                    navigate('/senior-dashboard');
                    break;
                case 'doctor':
                    navigate('/doctor-dashboard');
                    break;
                case 'caretaker':
                    navigate('/caretaker-dashboard');
                    break;
                default:
                    navigate('/login');
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.msg) {
                throw new Error(err.response.data.msg);
            } else {
                throw new Error('An unexpected error occurred. Please try again.');
            }
        }
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('token');
        navigate('/login');
    };

    const value = {
        currentUser,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
