// src/components/ManageVoters.jsx
import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';

const ManageVoters = () => {
    const [voters, setVoters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);

    // State for Add Voter form
    const [newVoter, setNewVoter] = useState({
        firstName: '',
        lastName: '',
        email: '',
        universityId: '',
        passwordHash: ''
    });

    // State for Edit Voter
    const [editingVoterId, setEditingVoterId] = useState(null);
    const [editVoterData, setEditVoterData] = useState({});

    // Import all necessary API functions
    const { getAllVoters, createVoter, updateVoter, deleteVoter } = useApi();
    const { userRole } = useAuth();

    // --- Helper to Fetch Voters ---
    const fetchVoters = async () => {
        setLoading(true);
        try {
            const data = await getAllVoters();
            setVoters(data);
        } catch (error) {
            console.error('Failed to load voters:', error);
        } finally {
            setLoading(false);
        }
    };

    // --- Initial Fetch & Role Check ---
    useEffect(() => {
        if (userRole === 'admin') {
            fetchVoters();
        }
    }, [getAllVoters, userRole]);

    // --- Filter Logic ---
    const filteredVoters = voters.filter(voter =>
        voter.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voter.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voter.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- Add Voter Handlers ---
    const handleAddVoter = async (e) => {
        e.preventDefault();
        try {
            // Remove 'approved: true' as it's no longer relevant for admin adds
            const voterToAdd = { ...newVoter };
            await createVoter(voterToAdd);
            await fetchVoters(); // Refresh the voter list

            // Reset form
            setNewVoter({
                firstName: '',
                lastName: '',
                email: '',
                universityId: '',
                passwordHash: ''
            });
            setShowAddForm(false);
        } catch (error) {
            console.error('Failed to add voter:', error);
            alert('Failed to add voter: ' + (error.message || 'Check console for details.'));
        }
    };

    const handleNewVoterInputChange = (e) => {
        const { name, value } = e.target;
        setNewVoter(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // --- Edit Voter Handlers ---
    const handleEditClick = (voter) => {
        setEditingVoterId(voter.id);
        // Copy all voter data needed for editing (excluding passwordHash)
        const { passwordHash, approved, ...dataWithoutSensitiveFields } = voter;
        setEditVoterData(dataWithoutSensitiveFields);
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditVoterData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCancelEdit = () => {
        setEditingVoterId(null);
        setEditVoterData({});
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        try {
            // Only send the fields that can be updated.
            const { firstName, lastName, email, universityId } = editVoterData;
            await updateVoter(editingVoterId, { firstName, lastName, email, universityId });

            setEditingVoterId(null);
            setEditVoterData({});
            await fetchVoters(); // Refresh the list
        } catch (error) {
            console.error('Failed to update voter:', error);
            alert('Failed to update voter: ' + (error.message || 'Check console for details.'));
        }
    };

    // --- Delete Voter Handler ---
    const handleDeleteVoter = async (voterId) => {
        if (window.confirm('Are you sure you want to delete this voter? This action cannot be undone.')) {
            try {
                await deleteVoter(voterId);
                await fetchVoters(); // Refresh the list
            } catch (error) {
                console.error('Failed to delete voter:', error);
                alert('Failed to delete voter: ' + (error.message || 'Check console for details.'));
            }
        }
    };

    if (loading) {
        return <div className="p-4">Loading voters...</div>;
    }

    // --- Component JSX Render ---
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-teal-800 mb-2">Manage Voters</h2>
            <p className="text-gray-600 mb-6">View, add, edit, and delete registered voters.</p>

            <div className="mb-6 flex justify-between items-center">
                <input
                    type="text"
                    placeholder="Search voters by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-input max-w-md"
                />
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className={`${showAddForm ? 'btn-danger' : 'btn-primary'} flex items-center`}
                >
                    {showAddForm ? 'Cancel Add' : '➕ Add New Voter'}
                </button>
            </div>

            {/* Add Voter Form */}
            {showAddForm && (
                <form onSubmit={handleAddVoter} className="mb-6 p-4 border border-teal-800 rounded bg-green-50">
                    <h3 className="text-xl font-semibold mb-4">Add New Voter</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={newVoter.firstName}
                            onChange={handleNewVoterInputChange}
                            required
                            className="form-input"
                        />
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={newVoter.lastName}
                            onChange={handleNewVoterInputChange}
                            required
                            className="form-input"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={newVoter.email}
                            onChange={handleNewVoterInputChange}
                            required
                            className="form-input"
                        />
                        <input
                            type="text"
                            name="universityId"
                            placeholder="University ID"
                            value={newVoter.universityId}
                            onChange={handleNewVoterInputChange}
                            required
                            className="form-input"
                        />
                        <input
                            type="password"
                            name="passwordHash"
                            placeholder="Password (Must be provided)"
                            value={newVoter.passwordHash}
                            onChange={handleNewVoterInputChange}
                            required
                            className="form-input md:col-span-2"
                        />
                    </div>
                    <button type="submit" className="btn-primary mt-4">
                        Add Voter
                    </button>
                </form>
            )}

            <hr className="my-6" />

            {/* Voter Table */}
            <div className="overflow-x-auto">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>University ID</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVoters.length > 0 ? (
                            filteredVoters.map(voter => (
                                // Conditional rendering for Edit Form
                                editingVoterId === voter.id ? (
                                    <tr key={voter.id} className="bg-yellow-50">
                                        <td className="py-2 px-4 border-b border-gray-200">{voter.id}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={editVoterData.firstName}
                                                onChange={handleEditInputChange}
                                                className="form-input mb-2"
                                                required
                                            />
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={editVoterData.lastName}
                                                onChange={handleEditInputChange}
                                                className="form-input"
                                                required
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-200">
                                            <input
                                                type="email"
                                                name="email"
                                                value={editVoterData.email}
                                                onChange={handleEditInputChange}
                                                className="form-input"
                                                required
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-200">
                                            <input
                                                type="text"
                                                name="universityId"
                                                value={editVoterData.universityId}
                                                onChange={handleEditInputChange}
                                                className="form-input"
                                                required
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-200">
                                            <button onClick={handleSaveEdit} className="btn-success mr-2">Save</button>
                                            <button onClick={handleCancelEdit} className="btn-danger">Cancel</button>
                                        </td>
                                    </tr>
                                ) : (
                                    // Default Read-only Row
                                    <tr key={voter.id}>
                                        <td className="py-2 px-4 border-b border-gray-200">{voter.id}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{voter.firstName} {voter.lastName}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{voter.email}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{voter.universityId}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">
                                            <button onClick={() => handleEditClick(voter)} className="btn-secondary mr-2">✏️ Edit</button>
                                            <button onClick={() => handleDeleteVoter(voter.id)} className="btn-danger">🗑️ Delete</button>
                                        </td>
                                    </tr>
                                )
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="py-2 px-4 border-b border-gray-200 text-center">
                                    No voters found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageVoters;