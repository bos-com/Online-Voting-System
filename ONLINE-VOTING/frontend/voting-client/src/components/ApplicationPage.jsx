// src/components/ApplicationPage.jsx
import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';

const ApplicationPage = () => {
    const [elections, setElections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        voter: null,
        elections: null,
        post: '',
        bio: ''
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const { getAllElections, createCandidate } = useApi();
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchElections = async () => {
            try {
                const data = await getAllElections();
                setElections(data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to load elections:', error);
                setErrorMessage('Failed to load elections. Please make sure the backend server is running.');
                setLoading(false);
            }
        };

        fetchElections();
    }, [getAllElections]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleElectionChange = (e) => {
        const electionId = parseInt(e.target.value);
        const selectedElection = elections.find(el => el.id === electionId);
        setFormData(prev => ({
            ...prev,
            elections: selectedElection
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        // Validate form data
        if (!formData.elections) {
            setErrorMessage('Please select an election');
            return;
        }

        if (!currentUser || !currentUser.id) {
            setErrorMessage('User not logged in properly. Please log in again.');
            return;
        }

        try {
            // Create the candidate application data with the correct structure
            const applicationData = {
                voter: { id: currentUser.id },
                elections: { id: formData.elections.id },
                post: formData.post,
                bio: formData.bio
            };

            const result = await createCandidate(applicationData);
            setSuccessMessage('Application submitted successfully! Waiting for admin approval.');
            // Reset form
            setFormData({
                voter: null,
                elections: null,
                post: '',
                bio: ''
            });
        } catch (error) {
            console.error('Error submitting application:', error);
            setErrorMessage(error.response?.data?.message || error.message || 'Failed to submit application. Please make sure the backend server is running.');
        }
    };

    if (loading) {
        return <div style={{ padding: '20px' }}>Loading elections...</div>;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '800px' }}>
            <h2>Apply to be a Candidate</h2>
            <p>Fill out the form below to apply for a position in an upcoming election.</p>

            {successMessage && (
                <div style={{
                    backgroundColor: '#d4edda',
                    color: '#155724',
                    padding: '10px',
                    borderRadius: '4px',
                    marginBottom: '20px'
                }}>
                    {successMessage}
                </div>
            )}

            {errorMessage && (
                <div style={{
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    padding: '10px',
                    borderRadius: '4px',
                    marginBottom: '20px'
                }}>
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{
                border: '1px solid #ddd',
                padding: '20px',
                borderRadius: '4px',
                backgroundColor: '#f9f9f9'
            }}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="election" style={{ display: 'block', marginBottom: '5px' }}>
                        Select Election:
                    </label>
                    <select
                        id="election"
                        onChange={handleElectionChange}
                        required
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px'
                        }}
                    >
                        <option value="">-- Select an Election --</option>
                        {elections.map(election => (
                            <option key={election.id} value={election.id}>
                                {election.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="post" style={{ display: 'block', marginBottom: '5px' }}>
                        Position Applying For:
                    </label>
                    <input
                        type="text"
                        id="post"
                        name="post"
                        value={formData.post}
                        onChange={handleInputChange}
                        required
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px'
                        }}
                        placeholder="e.g., President, Secretary, Treasurer"
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="bio" style={{ display: 'block', marginBottom: '5px' }}>
                        Bio/Statement:
                    </label>
                    <textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        required
                        rows="5"
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px'
                        }}
                        placeholder="Tell us about yourself and why you're running for this position..."
                    />
                </div>

                <button
                    type="submit"
                    style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Submit Application
                </button>
            </form>
        </div>
    );
};

export default ApplicationPage;