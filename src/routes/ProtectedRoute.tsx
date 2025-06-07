// src/routes/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        // Jika belum login, redirect ke login
        return <Navigate to="/login" replace />;
    }

    // Jika sudah login, render komponen anak
    return children;
};

export default ProtectedRoute;
