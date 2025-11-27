
// src/components/ManageElections.jsx
import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';

const ManageElections = () => {
    const [elections, setElections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        start_time: '',
        end_time: '',
        status: 'upcoming'
    });

    const { getAllElections, createElection, updateElectionStatus, deleteElection } = useApi();
    const { userRole } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllElections();
                setElections(data);
            } catch (error) {
                console.error('Failed to load elections:', error);
            } finally {
                setLoading(false);
            }
        };

        if (userRole === 'admin') {
            fetchData();
        }
    }, [getAllElections, userRole]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Ensure start_time and end_time are provided (existing logic)
            if (!formData.start_time || !formData.end_time) {
                alert('Both start time and end time are required.');
                return;
            }

            // CORRECTED LOGIC: Append ':00Z' to the local datetime string.
            // This sends a valid, UTC-aware ISO string directly to the Java Instant.
            const formattedData = {
                ...formData,
                // Example: "2025-11-27T10:00" + ":00Z" => "2025-11-27T10:00:00Z"
                start_time: formData.start_time ? formData.start_time + ':00Z' : null,
                end_time: formData.end_time ? formData.end_time + ':00Z' : null
            };

            // Additional validation to ensure times are not null (existing logic)
            if (!formattedData.start_time || !formattedData.end_time) {
                alert('Both start time and end time must be provided.');
                return;
            }

            await createElection(formattedData);
            // Refresh elections list
            const data = await getAllElections();
            setElections(data);
            // Reset form
            setFormData({
                name: '',
                description: '',
                start_time: '',
                end_time: '',
                status: 'upcoming'
            });
            setShowForm(false);
        } catch (error) {
            console.error('Failed to create election:', error);
            alert('Failed to create election. Please try again.');
        }
    };

    const handleStatusChange = async (electionId, newStatus) => {
        if (!window.confirm(`Are you sure you want to change the status of election ID ${electionId} to ${newStatus}?`)) {
            return;
        }
        try {
            await updateElectionStatus(electionId, newStatus);
            // Refresh the list immediately after success
            const data = await getAllElections();
            setElections(data);
        } catch (error) {
            console.error(`Failed to update status for election ${electionId}:`, error);
            alert('Failed to update election status. Check console for details.');
        }
    };

    const handleDeleteElection = async (electionId) => {
        if (!window.confirm(`Are you sure you want to delete election ID ${electionId}? This action cannot be undone.`)) {
            return;
        }
        try {
            await deleteElection(electionId);
            // Refresh the list immediately after success
            const data = await getAllElections();
            setElections(data);
        } catch (error) {
            console.error(`Failed to delete election ${electionId}:`, error);
            alert('Failed to delete election. Check console for details.');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString();
    };

    if (loading) {
        return <div style={{ padding: '20px' }}>Loading elections...</div>;
    }

    return (
        <div style={{ padding: '20px' }}>

            <p>Dear Admin, Create and manage elections Here.</p>

            <button
                onClick={() => setShowForm(!showForm)}
                style={{
                    marginBottom: '20px',
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                {showForm ? 'Cancel' : 'Create New Election'}
            </button>

            {showForm && (
                <form onSubmit={handleSubmit} style={{
                    marginBottom: '30px',
                    padding: '20px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    backgroundColor: '#f9f9f9'
                }}>
                    <h3>Create New Election</h3>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #ddd',
                                borderRadius: '4px'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Description:</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #ddd',
                                borderRadius: '4px'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Start Time: *</label>
                        <input
                            type="datetime-local"
                            name="start_time"
                            value={formData.start_time}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #ddd',
                                borderRadius: '4px'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>End Time: *</label>
                        <input
                            type="datetime-local"
                            name="end_time"
                            value={formData.end_time}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #ddd',
                                borderRadius: '4px'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Status:</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #ddd',
                                borderRadius: '4px'
                            }}
                        >
                            <option value="upcoming">Upcoming</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Create Election
                    </button>
                </form>
            )}

            <h3>Existing Elections</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {elections.length > 0 ? (
                    elections.map(election => (
                        <div key={election.id} style={{
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            padding: '15px',
                            backgroundColor: '#f9f9f9'
                        }}>
                            <h3 style={{ margin: '0 0 10px 0' }}>{election.name}</h3>
                            <p style={{ margin: '5px 0', color: '#666' }}>
                                <strong>Description:</strong> {election.description || 'No description'}
                            </p>
                            <p style={{ margin: '5px 0', color: '#666' }}>
                                <strong>Start Time:</strong> {formatDate(election.start_time)}
                            </p>
                            <p style={{ margin: '5px 0', color: '#666' }}>
                                <strong>End Time:</strong> {formatDate(election.end_time)}
                            </p>
                            <p style={{ margin: '5px 0', color: '#666' }}>
                                <strong>Status:</strong>{' '}
                                <select
                                    value={election.status}
                                    onChange={(e) => handleStatusChange(election.id, e.target.value)}
                                    style={{ marginLeft: '10px', padding: '5px', borderRadius: '4px' }}
                                >
                                    <option value="upcoming">Upcoming</option>
                                    <option value="active">Active</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </p>
                            <button
                                onClick={() => handleDeleteElection(election.id)}
                                style={{
                                    marginTop: '10px',
                                    padding: '5px 10px',
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Delete Election
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No elections found.</p>
                )}
            </div>
        </div>
    );
};

export default ManageElections;