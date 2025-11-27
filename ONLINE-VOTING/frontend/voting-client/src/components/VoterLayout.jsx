// src/components/VoterLayout.jsx
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // To handle logout

const VoterLayout = () => {
    const { logout } = useAuth();
    const location = useLocation();

    // Navigation items
    const navItems = [
        { name: 'Dashboard', path: '/voter/dashboard' },
        { name: 'Elections & Candidates', path: '/voter/candidates' },
        { name: 'Apply for Post', path: '/voter/apply' }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Voter Navigation Bar */}
            <nav className="bg-gray-800 text-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 text-white font-bold text-xl">
                                Voter Portal
                            </div>
                            <div className="hidden md:block">
                                <div className="ml-10 flex items-baseline space-x-4">
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.name}
                                            to={item.path}
                                            className={`text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium ${location.pathname === item.path ? 'bg-gray-900' : ''}`}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="btn-danger"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile menu (optional) */}
            <div className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium ${location.pathname === item.path ? 'bg-gray-900' : ''}`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Main content */}
            <main className="content">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default VoterLayout;