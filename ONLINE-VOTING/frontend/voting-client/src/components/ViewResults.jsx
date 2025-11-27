// src/components/ViewResults.jsx
import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';

const ViewResults = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedElection, setSelectedElection] = useState('');
    const [elections, setElections] = useState([]);
    const { getVoteCountsByElection, getAllElections } = useApi();
    const { userRole } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const electionsData = await getAllElections();
                setElections(electionsData);

                if (electionsData.length > 0) {
                    setSelectedElection(electionsData[0].id);
                }
            } catch (error) {
                console.error('Failed to load elections:', error);
            }
        };

        if (userRole === 'admin') {
            fetchData();
        }
    }, [getAllElections, userRole]);

    useEffect(() => {
        const fetchResults = async () => {
            if (selectedElection) {
                try {
                    const data = await getVoteCountsByElection(selectedElection);
                    setResults(data);
                } catch (error) {
                    console.error('Failed to load results:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        if (userRole === 'admin') {
            fetchResults();
        }
    }, [selectedElection, getVoteCountsByElection, userRole]);

    if (loading) {
        return <div style={{ padding: '20px' }}>Loading results...</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2>Election Results</h2>
            <p>View vote tallies for completed elections.</p>

            <div style={{ marginBottom: '20px' }}>
                <label style={{ marginRight: '10px' }}>Select Election:</label>
                <select
                    value={selectedElection}
                    onChange={(e) => setSelectedElection(e.target.value)}
                    style={{
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                    }}
                >
                    {elections.map(election => (
                        <option key={election.id} value={election.id}>
                            {election.name}
                        </option>
                    ))}
                </select>
            </div>

            {results.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f2f2f2' }}>
                                <th style={tableHeaderStyle}>Candidate</th>
                                <th style={tableHeaderStyle}>Post</th>
                                <th style={tableHeaderStyle}>Votes</th>
                                <th style={tableHeaderStyle}>Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map(([candidate, voteCount]) => (
                                <tr key={candidate.candidateId} style={tableRowStyle}>
                                    <td style={tableCellStyle}>
                                        {candidate.voter?.firstName} {candidate.voter?.lastName}
                                    </td>
                                    <td style={tableCellStyle}>{candidate.post}</td>
                                    <td style={tableCellStyle}>{voteCount}</td>
                                    <td style={tableCellStyle}>
                                        {((voteCount / results.reduce((sum, [_, count]) => sum + count, 0)) * 100).toFixed(1)}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No votes recorded for the selected election.</p>
            )}
        </div>
    );
};

const tableHeaderStyle = {
    padding: '12px',
    textAlign: 'left',
    borderBottom: '2px solid #ddd'
};

const tableRowStyle = {
    borderBottom: '1px solid #ddd',
    ':hover': {
        backgroundColor: '#f5f5f5'
    }
};

const tableCellStyle = {
    padding: '12px',
    borderBottom: '1px solid #ddd'
};

export default ViewResults;