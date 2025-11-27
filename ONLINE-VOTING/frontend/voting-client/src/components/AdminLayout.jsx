// src/components/AdminLayout.jsx
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
    const { logout } = useAuth();
    const location = useLocation();

    // Navigation items
    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard' },
        { name: 'Manage Voters', path: '/admin/voters' },
        { name: 'Manage Candidates', path: '/admin/candidates' },
        { name: 'Manage Elections', path: '/admin/elections' },
        { name: 'View Results', path: '/admin/results' }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Admin Navigation Bar */}
            <nav className="navbar">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 text-white font-bold text-xl">
                                Admin Panel
                            </div>
                            <div className="hidden md:block">
                                <div className="ml-10 flex items-baseline space-x-4">
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.name}
                                            to={item.path}
                                            className={`nav-link ${location.pathname === item.path ? 'nav-link-active' : ''}`}
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
                            className={`nav-link block px-3 py-2 rounded-md text-base font-medium ${location.pathname === item.path ? 'nav-link-active' : ''}`}
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

export default AdminLayout;