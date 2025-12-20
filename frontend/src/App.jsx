// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import RoleBasedLogin from './components/RoleBasedLogin';
import SeniorDashboard from './components/SeniorDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import CaretakerDashboard from './components/CaretakerDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { currentUser, loading } = useAuth();
    
    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-900 mx-auto mb-4"></div>
                    <p className="text-slate-600 font-semibold">Loading...</p>
                </div>
            </div>
        );
    }
    
    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }
    
    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<RoleBasedLogin />} />
                    
                    <Route 
                        path="/senior-dashboard" 
                        element={
                            <ProtectedRoute allowedRoles={['senior']}>
                                <SeniorDashboard />
                            </ProtectedRoute>
                        } 
                    />
                    
                    <Route 
                        path="/doctor-dashboard" 
                        element={
                            <ProtectedRoute allowedRoles={['doctor']}>
                                <DoctorDashboard />
                            </ProtectedRoute>
                        } 
                    />
                    
                    <Route 
                        path="/caretaker-dashboard" 
                        element={
                            <ProtectedRoute allowedRoles={['caretaker']}>
                                <CaretakerDashboard />
                            </ProtectedRoute>
                        } 
                    />
                    
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
