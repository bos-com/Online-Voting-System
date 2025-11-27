// src/components/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// Assuming useApi isn't strictly needed here since we are using 'fetch' directly
// import { useApi } from '../hooks/useApi'; 

const LoginPage = () => {
    const [role, setRole] = useState('voter'); // Default to voter

    // Voter State
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [universityId, setUniversityId] = useState('');

    // ➡️ 1. NEW ADMIN STATE: State variables for admin credentials
    const [adminUsername, setAdminUsername] = useState('');
    const [adminPassword, setAdminPassword] = useState('');

    // General State
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { loginVoter, loginAdmin } = useAuth(); // Get the login functions from context
    // const { loginVoter: apiLoginVoter } = useApi(); // Commented out unused hook

    // --- VOTER LOGIN LOGIC (No changes needed here for admin feature) ---
    const handleVoterLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const loginData = {
                firstName,
                lastName,
                email,
                universityId
            };

            const response = await fetch('http://localhost:8080/api/v1/voters/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });

            if (response.ok) {
                const voterData = await response.json();
                loginVoter(voterData);
                navigate('/voter/dashboard', { replace: true });
            } else if (response.status === 403) {
                setError('Your account is pending admin approval');
            } else if (response.status === 404) {
                setError('Invalid credentials or account not found');
            } else {
                setError('Login failed. Please try again.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    // ------------------------------------------------------------------


    // ➡️ 2. UPDATED ADMIN LOGIN LOGIC: Now handles credentials and API call
    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Prepare the admin login data
            const loginData = {
                username: adminUsername,
                password: adminPassword
            };

            // ⚠️ This is the new API call for the admin backend endpoint
            const response = await fetch('http://localhost:8080/api/v1/admins/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });

            if (response.ok) {
                const adminData = await response.json();
                // Pass the admin data to your AuthContext function
                loginAdmin(adminData);
                // Clear the form fields upon success
                setAdminUsername('');
                setAdminPassword('');
                navigate('/admin/dashboard', { replace: true });
            } else if (response.status === 401) {
                setError('Invalid admin credentials.');
            } else {
                setError('Admin login failed. Please try again.');
            }

        } catch (err) {
            console.error('Admin Login error:', err);
            setError('Network error or server unavailable.');
        } finally {
            setLoading(false);
        }
    };
    // ------------------------------------------------------------------

    // Helper to reset the form states when switching roles
    const switchRole = (newRole) => {
        setRole(newRole);
        setError('');
        setLoading(false);
        // Reset admin fields when switching to voter
        if (newRole === 'voter') {
            setAdminUsername('');
            setAdminPassword('');
        }
        // Reset voter fields when switching to admin
        if (newRole === 'admin') {
            setFirstName('');
            setLastName('');
            setEmail('');
            setUniversityId('');
        }
    };

    // --- Conditional Rendering ---

    if (role === 'voter') {
        // ... (Voter Login form remains the same) ...
        return (
            <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-teal-800 mb-6 text-center">Voter Login</h2>
                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleVoterLogin}>
                    {/* ... (Voter Form Inputs: First Name, Last Name, Email, University ID) ... */}
                    <div className="form-group">
                        <label className="form-label">First Name:</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Last Name:</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">University ID:</label>
                        <input
                            type="text"
                            value={universityId}
                            onChange={(e) => setUniversityId(e.target.value)}
                            required
                            className="form-input"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`btn-primary w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Logging in...' : 'Login as Voter'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p>Not registered yet? Contact your administrator.</p>
                    <p className="mt-4">
                        <button
                            onClick={() => switchRole('admin')}
                            className="text-teal-600 hover:text-teal-800 underline bg-none border-none cursor-pointer"
                        >
                            Login as Admin instead
                        </button>
                    </p>
                </div>
            </div>
        );
    } else {
        // ➡️ 3. UPDATED ADMIN LOGIN UI: Added input fields for credentials
        return (
            <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-teal-800 mb-6 text-center">Admin Login</h2>
                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleAdminLogin}>
                    <div className="form-group">
                        <label className="form-label">Username:</label>
                        <input
                            type="text"
                            value={adminUsername}
                            onChange={(e) => setAdminUsername(e.target.value)}
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password:</label>
                        <input
                            type="password"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            required
                            className="form-input"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`btn-primary w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Logging in...' : 'Login as Admin'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => switchRole('voter')}
                        className="text-teal-600 hover:text-teal-800 underline bg-none border-none cursor-pointer"
                    >
                        Login as Voter instead
                    </button>
                </div>
            </div>
        );
    }
};

export default LoginPage;