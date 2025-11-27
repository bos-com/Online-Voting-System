// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Use a string to represent the role: 'voter', 'admin', or null (logged out)
    const [userRole, setUserRole] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // This will hold the user data (voterData or adminData)
    const [currentUser, setCurrentUser] = useState(null);

    // Function to handle voter login with actual credentials
    const loginVoter = (voterData) => {
        setIsLoggedIn(true);
        setUserRole('voter');
        // Store the voter's data
        setCurrentUser(voterData);
        // In a real app, you would store the token in local storage here
    };

    // Function to handle admin login, now accepting adminData
    const loginAdmin = (adminData) => { // ⬅️ **MODIFIED HERE**
        setIsLoggedIn(true);
        setUserRole('admin');
        // Store the admin's data
        setCurrentUser(adminData); // ⬅️ **MODIFIED HERE**
        // In a real app, you would store the token in local storage here
    };

    // Function to handle logout
    const logout = () => {
        setIsLoggedIn(false);
        setUserRole(null);
        setCurrentUser(null);
        // In a real app, you would remove the token from local storage here
    };

    const value = {
        isLoggedIn,
        userRole,
        currentUser,
        loginVoter,
        loginAdmin,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context easily
export const useAuth = () => {
    return useContext(AuthContext);
};