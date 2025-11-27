// src/components/CandidatesPage.jsx
import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';

const CandidatesPage = () => {
    const [elections, setElections] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [selectedElection, setSelectedElection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [voteCast, setVoteCast] = useState(false);
    const [votedCandidate, setVotedCandidate] = useState(null);
    const { getAllElections, getCandidatesByElection, submitVote } = useApi();
    const { currentUser } = useAuth();

    useEffect(() => {
        const loadElections = async () => {
            try {
                const data = await getAllElections();
                setElections(data);
                // Automatically select the first election if available
                if (data.length > 0) {
                    setSelectedElection(data[0]);
                }
            } catch (error) {
                console.error("Failed to load elections:", error);
            } finally {
                setLoading(false);
            }
        };

        loadElections();
    }, [getAllElections]);

    useEffect(() => {
        const loadCandidates = async () => {
            if (!selectedElection) return;

            try {
                const data = await getCandidatesByElection(selectedElection.id);
                // Show all candidates, but visually distinguish approved vs pending
                setCandidates(data);
            } catch (error) {
                console.error("Failed to load candidates:", error);
                setCandidates([]);
            }
        };

        loadCandidates();
    }, [selectedElection, getCandidatesByElection]);

    const handleElectionChange = (election) => {
        setSelectedElection(election);
        setVoteCast(false); // Reset vote status when changing elections
        setVotedCandidate(null);
    };

    const handleVote = async (candidateId, candidateName) => {
        if (!currentUser) {
            alert("You must be logged in to vote.");
            return;
        }

        const voteData = {
            voterId: currentUser.id,
            candidateId,
            electionId: selectedElection.id
        };

        try {
            await submitVote(voteData);
            setVotedCandidate(candidateName);
            setVoteCast(true);
        } catch (error) {
            alert("Vote submission failed. Please try again.");
            console.error('Vote error:', error);
        }
    };

    if (loading) {
        return <div className="p-4 text-center text-xl font-semibold">Loading elections...</div>;
    }

    if (voteCast) {
        return (
            <div className="card bg-green-100 border-l-4 border-green-500 text-green-700 max-w-lg mx-auto mt-10">
                <h2 className="text-2xl font-bold mb-3">✅ Vote Successful!</h2>
                <p className="text-lg">Thank you for participating in the election.</p>
                <p className="mt-2">Your vote for <strong>{votedCandidate}</strong> has been securely recorded.</p>
                <button
                    onClick={() => {
                        setVoteCast(false);
                        setVotedCandidate(null);
                    }}
                    className="btn-primary mt-4"
                >
                    View More Elections
                </button>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-semibold mb-6 text-gray-800">Elections & Candidates</h1>

            {/* Election Selector */}
            <div className="mb-6">
                <label className="block text-lg font-medium mb-2">Select an Election:</label>
                <div className="flex flex-wrap gap-2">
                    {elections.map(election => (
                        <button
                            key={election.id}
                            onClick={() => handleElectionChange(election)}
                            className={`px-4 py-2 rounded-lg ${selectedElection && selectedElection.id === election.id
                                ? 'bg-teal-700 text-white'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                        >
                            {election.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Election Details */}
            {selectedElection && (
                <div className="card bg-blue-50 border border-blue-200">
                    <h2 className="text-2xl font-bold text-teal-800">{selectedElection.name}</h2>
                    <p className="text-gray-700 mt-2">{selectedElection.description}</p>
                    <div className="mt-2 text-sm text-gray-600">
                        <p><strong>Start Time:</strong> {new Date(selectedElection.start_time).toLocaleString()}</p>
                        <p><strong>End Time:</strong> {new Date(selectedElection.end_time).toLocaleString()}</p>
                        <p><strong>Status:</strong> <span className={`font-semibold ${selectedElection.status === 'active' ? 'text-success' :
                            selectedElection.status === 'upcoming' ? 'text-warning' : 'text-error'
                            }`}>
                            {selectedElection.status}
                        </span></p>
                    </div>
                </div>
            )}

            {/* Candidates List */}
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Candidates {selectedElection ? `for ${selectedElection.name}` : ''}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {candidates.length > 0 ? (
                    candidates.map(candidate => (
                        <div
                            key={candidate.candidateId}
                            className={`card ${candidate.approved
                                ? 'border border-green-200'
                                : 'border border-yellow-200'
                                }`}
                        >
                            <h3 className="text-xl font-bold text-teal-700">
                                {candidate.voter?.firstName} {candidate.voter?.lastName}
                            </h3>
                            <p className="text-sm text-gray-500 mb-2">Post: {candidate.post || 'N/A'}</p>
                            <p className="text-sm text-gray-600 mb-4">{candidate.bio || 'No bio available'}</p>

                            {/* Approval status indicator */}
                            <div className="mb-3">
                                <span className={`inline-block px-2 py-1 text-xs rounded ${candidate.approved
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {candidate.approved ? 'Approved' : 'Pending Approval'}
                                </span>
                            </div>

                            {selectedElection && selectedElection.status === 'active' ? (
                                candidate.approved ? (
                                    <button
                                        onClick={() => handleVote(
                                            candidate.candidateId,
                                            `${candidate.voter?.firstName} ${candidate.voter?.lastName}`
                                        )}
                                        className="btn-primary w-full"
                                    >
                                        Cast Vote
                                    </button>
                                ) : (
                                    <button
                                        disabled
                                        className="btn-secondary w-full opacity-50 cursor-not-allowed"
                                    >
                                        Not Approved Yet
                                    </button>
                                )
                            ) : (
                                <button
                                    disabled
                                    className="btn-secondary w-full opacity-50 cursor-not-allowed"
                                >
                                    Voting Not Active
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-10">
                        <p className="text-xl text-gray-500">
                            {selectedElection
                                ? "No candidates found for this election."
                                : "Please select an election to view candidates."}
                        </p>
                    </div>
                )}
            </div>

            {!elections.length && (
                <p className="text-center text-xl text-gray-500 mt-10">No elections found.</p>
            )}
        </div>
    );
};

export default CandidatesPage;