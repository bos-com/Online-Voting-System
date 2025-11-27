// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// 'requiredRole' will be either 'voter' or 'admin'
const ProtectedRoute = ({ children, requiredRole }) => {
    const { isLoggedIn, userRole } = useAuth();

    // 1. If user is not logged in, redirect to login page
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    // 2. If user is logged in but doesn't have the required role, redirect to their dashboard
    if (requiredRole && userRole !== requiredRole) {
        // Redirect admin to admin dashboard, voter to voter dashboard
        const redirectTo = userRole === 'admin' ? '/admin/dashboard' : '/voter/dashboard';

        // Fallback: If role is defined but access is denied, go home
        if (!redirectTo) {
            return <Navigate to="/" replace />;
        }

        alert(`Access Denied! You must be a ${requiredRole}.`);
        return <Navigate to={redirectTo} replace />;
    }

    // 3. If access is granted, render the child component (the desired page)
    return children;
};

export default ProtectedRoute;