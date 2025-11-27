// src/components/ManageCandidates.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';

const ManageCandidates = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedElection, setSelectedElection] = useState('');
    const [elections, setElections] = useState([]);
    const [error, setError] = useState('');
    const { getCandidatesByElection, getAllElections, updateCandidate, deleteCandidate } = useApi();
    const { userRole } = useAuth();

    // Refs to prevent race conditions
    const isMountedRef = useRef(false);
    const loadingRef = useRef(false);

    // Load elections data - run only once on component mount
    useEffect(() => {
        isMountedRef.current = true;
        loadingRef.current = true;

        const loadElections = async () => {
            if (userRole !== 'admin' || !isMountedRef.current) return;

            try {
                setError('');
                const electionsData = await getAllElections();
                if (!isMountedRef.current) return;

                setElections(electionsData);

                // Set the first election as selected if none is selected and we have elections
                if (electionsData.length > 0 && !selectedElection) {
                    setSelectedElection(electionsData[0].id.toString());
                }
            } catch (error) {
                if (!isMountedRef.current) return;
                console.error('Failed to load elections:', error);
                setError('Failed to load elections. Please make sure the backend server is running.');
            } finally {
                if (isMountedRef.current) {
                    loadingRef.current = false;
                }
            }
        };

        loadElections();

        return () => {
            isMountedRef.current = false;
        };
    }, [getAllElections, userRole]); // Removed selectedElection from dependencies to prevent loop

    // Load candidates data when election changes
    useEffect(() => {
        const loadCandidates = async () => {
            if (userRole !== 'admin' || !selectedElection || !isMountedRef.current) return;

            try {
                setLoading(true);
                setError('');
                const data = await getCandidatesByElection(selectedElection);
                if (!isMountedRef.current) return;
                setCandidates(data);
            } catch (error) {
                if (!isMountedRef.current) return;
                console.error('Failed to load candidates:', error);
                setError('Failed to load candidates. Please make sure the backend server is running.');
                setCandidates([]);
            } finally {
                if (isMountedRef.current) {
                    setLoading(false);
                }
            }
        };

        loadCandidates();
    }, [selectedElection, getCandidatesByElection, userRole]); // Only depend on selectedElection

    const handleApprovalChange = async (candidateId, currentApproved) => {
        // Find the candidate in the local state to preserve all fields
        const candidate = candidates.find(c => c.candidateId === candidateId);
        if (!candidate) {
            console.error('Candidate not found');
            return;
        }

        try {
            // Send all candidate data with updated approval status
            const updatedCandidateData = {
                ...candidate,
                approved: !currentApproved
            };

            await updateCandidate(candidateId, updatedCandidateData);

            // Update local state
            if (isMountedRef.current) {
                setCandidates(prev => prev.map(c =>
                    c.candidateId === candidateId
                        ? { ...c, approved: !currentApproved }
                        : c
                ));
            }
        } catch (error) {
            console.error('Failed to update approval status:', error);
            alert('Failed to update approval status. Please make sure the backend server is running.');
        }
    };

    const handleDeleteCandidate = async (candidateId) => {
        // Find the candidate name for the confirmation message
        const candidate = candidates.find(c => c.candidateId === candidateId);
        const candidateName = candidate ? `${candidate.voter?.firstName} ${candidate.voter?.lastName}` : 'this candidate';

        if (!window.confirm(`Are you sure you want to delete ${candidateName}? This action cannot be undone.`)) {
            return;
        }

        try {
            await deleteCandidate(candidateId);

            // Update local state to remove the deleted candidate
            if (isMountedRef.current) {
                setCandidates(prev => prev.filter(c => c.candidateId !== candidateId));
            }
        } catch (error) {
            console.error('Failed to delete candidate:', error);
            // Provide more detailed error information
            let errorMessage = 'Failed to delete candidate. ';
            if (error.response) {
                // Server responded with an error status
                errorMessage += `Server responded with status ${error.response.status}. `;
                if (error.response.data) {
                    errorMessage += `Message: ${error.response.data}. `;
                }
            } else if (error.request) {
                // Request was made but no response received
                errorMessage += 'No response received from server. Please make sure the backend server is running and accessible. ';
            } else {
                // Something else happened
                errorMessage += `Error: ${error.message}. `;
            }
            alert(errorMessage);
        }
    };

    // Handle election selection change
    const handleElectionChange = (e) => {
        setSelectedElection(e.target.value);
    };

    // Show loading state only on initial load
    if ((loading || loadingRef.current) && candidates.length === 0 && elections.length === 0) {
        return <div style={{ padding: '20px' }}>Loading candidates and elections...</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2>Manage Candidates & Posts</h2>
            <p>Review and approve candidate applications.</p>

            {error && (
                <div style={{
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    padding: '10px',
                    borderRadius: '4px',
                    marginBottom: '20px'
                }}>
                    {error}
                </div>
            )}

            <div style={{ marginBottom: '20px' }}>
                <label style={{ marginRight: '10px' }}>Select Election:</label>
                <select
                    value={selectedElection}
                    onChange={handleElectionChange}
                    style={{
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                    }}
                    disabled={elections.length === 0}
                >
                    <option value="">-- Select Election --</option>
                    {elections.map(election => (
                        <option key={election.id} value={election.id}>
                            {election.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Show loading indicator when switching elections */}
            {(loading || loadingRef.current) && candidates.length > 0 && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    Loading candidates for selected election...
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {(!loading && !loadingRef.current) && candidates.length > 0 ? (
                    candidates.map(candidate => (
                        <div key={candidate.candidateId} style={{
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            padding: '15px',
                            backgroundColor: '#f9f9f9'
                        }}>
                            <h3 style={{ margin: '0 0 10px 0' }}>
                                {candidate.voter?.firstName} {candidate.voter?.lastName}
                            </h3>
                            <p style={{ margin: '5px 0', color: '#666' }}>
                                <strong>Post:</strong> {candidate.post}
                            </p>
                            <p style={{ margin: '5px 0', color: '#666' }}>
                                <strong>Email:</strong> {candidate.voter?.email}
                            </p>
                            <p style={{ margin: '5px 0', color: '#666' }}>
                                <strong>Bio:</strong> {candidate.bio || 'No bio provided'}
                            </p>
                            <p style={{ margin: '5px 0', color: '#666' }}>
                                <strong>Status:</strong>{' '}
                                <span style={{
                                    padding: '5px 10px',
                                    borderRadius: '12px',
                                    backgroundColor: candidate.approved ? '#d4edda' : '#fff3cd',
                                    color: candidate.approved ? '#155724' : '#856404'
                                }}>
                                    {candidate.approved ? 'Approved' : 'Pending'}
                                </span>
                            </p>
                            <p style={{ margin: '5px 0', color: '#666' }}>
                                <strong>Registered:</strong>{' '}
                                {candidate.dateRegistered ? new Date(candidate.dateRegistered).toLocaleString() : 'N/A'}
                            </p>

                            <button
                                onClick={() => handleApprovalChange(candidate.candidateId, candidate.approved)}
                                style={{
                                    marginTop: '10px',
                                    padding: '8px 16px',
                                    backgroundColor: candidate.approved ? '#dc3545' : '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                {candidate.approved ? 'Disapprove' : 'Approve'}
                            </button>

                            <button
                                onClick={() => handleDeleteCandidate(candidate.candidateId)}
                                style={{
                                    marginTop: '10px',
                                    padding: '8px 16px',
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    ))
                ) : (
                    (!loading && !loadingRef.current) && <p>No candidates found for the selected election.</p>
                )}
            </div>
        </div>
    );
};

export default ManageCandidates;