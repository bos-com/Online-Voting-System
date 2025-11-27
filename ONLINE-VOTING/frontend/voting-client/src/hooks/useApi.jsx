// src/hooks/useApi.jsx
import axios from 'axios';
import { useCallback } from 'react'; // <--- 1. Import useCallback

const apiClient = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include authentication if available
apiClient.interceptors.request.use(
    (config) => {
        // In a real app, you would get the token from local storage or context
        // and add it to the Authorization header
        // const token = localStorage.getItem('token');
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for better error handling (This part is fine)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response) {
            // Network error
            console.error('Network error: Please check if the backend server is running');
            return Promise.reject(new Error('Network error: Please check if the backend server is running'));
        }
        return Promise.reject(error);
    }
);

export const useApi = () => {
    // ----------------------------------------------------------------------
    // All API functions are now WRAPPED IN useCallback
    // ----------------------------------------------------------------------

    const loginVoter = useCallback(async (firstName, email) => {
        try {
            const response = await apiClient.post('/api/v1/voters/login', { firstName, email });
            return response.data;
        } catch (error) {
            console.error('Error logging in voter:', error);
            throw error;
        }
    }, []); // Empty dependency array means this function is created once

    const registerVoter = useCallback(async (voterData) => {
        try {
            const response = await apiClient.post('/api/v1/voters/register', voterData);
            return response.data;
        } catch (error) {
            console.error('Error registering voter:', error);
            throw error;
        }
    }, []);

    const getAllVoters = useCallback(async () => {
        try {
            const response = await apiClient.get('/api/v1/voters');
            return response.data;
        }
        catch (error) {
            console.error('Error fetching voters:', error);
            throw error;
        }
    }, []);

    const approveVoter = useCallback(async (id, approved = true) => {
        try {
            const response = await apiClient.put(`/api/v1/voters/${id}/approve?approved=${approved}`);
            return response.data;
        } catch (error) {
            console.error('Error approving voter:', error);
            throw error;
        }
    }, []);
    const updateElectionStatus = useCallback(async (electionId, newStatus) => {
        try {
            const response = await apiClient.put(`/api/v1/elections/${electionId}/status`, { status: newStatus });
            return response.data;
        } catch (error) {
            console.error('Error updating election status:', error);
            throw error;
        }
    }, []);

    const loginAdmin = useCallback(async (username, password) => {
        try {
            // This assumes your backend uses a dedicated endpoint for admin login 
            // and uses username/password credentials. Adjust the URL as needed!
            // Maps to POST /api/v1/admins/login 
            const response = await apiClient.post('/api/v1/admins/login', { username, password });
            return response.data;
        } catch (error) {
            console.error('Error logging in admin:', error);
            throw error;
        }
    }, []);
    // --- NEW FUNCTION FOR UPDATING VOTER DETAILS (ISSUE 3) ---
    // Maps to PUT /api/v1/voters/{id}
    const updateVoter = useCallback(async (voterId, voterData) => {
        try {
            const response = await apiClient.put(`/api/v1/voters/${voterId}`, voterData);
            return response.data;
        } catch (error) {
            console.error(`Error updating voter ID ${voterId}:`, error);
            throw error;
        }
    }, []);
    // --- NEW FUNCTION FOR DELETING VOTER (ISSUE 3) ---
    // Maps to DELETE /api/v1/voters/{id}
    const deleteVoter = useCallback(async (voterId) => {
        try {
            const response = await apiClient.delete(`/api/v1/voters/${voterId}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting voter ID ${voterId}:`, error);
            throw error;
        }
    }, []);

    // Get all elections (USED IN CandidatesPage useEffect)
    const getAllElections = useCallback(async () => {
        try {
            const response = await apiClient.get('/api/v1/elections');
            return response.data;
        } catch (error) {
            console.error('Error fetching elections:', error);
            throw error;
        }
    }, []);

    // Get candidates by election (USED IN CandidatesPage useEffect)
    const getCandidatesByElection = useCallback(async (electionId) => {
        try {
            const response = await apiClient.get(`/api/v1/candidates/election/${electionId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching candidates:', error);
            throw error;
        }
    }, []);

    // Get vote counts by election
    const getVoteCountsByElection = useCallback(async (electionId) => {
        try {
            const response = await apiClient.get(`/api/v1/votes/election/${electionId}/count`);
            return response.data;
        } catch (error) {
            console.error('Error fetching vote counts:', error);
            throw error;
        }
    }, []);

    // Submit a vote
    const submitVote = useCallback(async (voteData) => {
        try {
            const response = await apiClient.post('/api/v1/votes', {
                voter: { id: voteData.voterId },
                candidate: { candidateId: voteData.candidateId },
                election: { id: voteData.electionId },
                timestamp: new Date().toISOString()
            });
            return response.data;
        } catch (error) {
            console.error('Error submitting vote:', error);
            throw error;
        }
    }, []);

    // Create new voter (admin only)
    const createVoter = useCallback(async (voterData) => {
        try {
            const response = await apiClient.post('/api/v1/voters/register', voterData);
            return response.data;
        } catch (error) {
            console.error('Error creating voter:', error);
            throw error;
        }
    }, []);

    // Create new election (admin only)
    const createElection = useCallback(async (electionData) => {
        try {
            const response = await apiClient.post('/api/v1/elections', electionData);
            return response.data;
        } catch (error) {
            console.error('Error creating election:', error);
            throw error;
        }
    }, []);

    // Delete election (admin only)
    const deleteElection = useCallback(async (electionId) => {
        try {
            const response = await apiClient.delete(`/api/v1/elections/${electionId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting election:', error);
            throw error;
        }
    }, []);

    // Create new candidate
    const createCandidate = useCallback(async (candidateData) => {
        try {
            const response = await apiClient.post('/api/v1/candidates', candidateData);
            return response.data;
        } catch (error) {
            console.error('Error creating candidate:', error);
            throw error;
        }
    }, []);

    // Update candidate approval status (admin only)
    const updateCandidateApproval = useCallback(async (candidateId, approved) => {
        try {
            const response = await apiClient.put(`/api/v1/candidates/${candidateId}`, { approved });
            return response.data;
        } catch (error) {
            console.error('Error updating candidate approval:', error);
            throw error;
        }
    }, []);

    // Update candidate with full data (admin only)
    const updateCandidate = useCallback(async (candidateId, candidateData) => {
        try {
            const response = await apiClient.put(`/api/v1/candidates/${candidateId}`, candidateData);
            return response.data;
        } catch (error) {
            console.error('Error updating candidate:', error);
            throw error;
        }
    }, []);

    // Delete candidate (admin only)
    const deleteCandidate = useCallback(async (candidateId) => {
        try {
            const response = await apiClient.delete(`/api/v1/candidates/${candidateId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting candidate:', error);
            throw error;
        }
    }, []);

    // ----------------------------------------------------------------------
    // Return all functions
    // ----------------------------------------------------------------------
    return {
        getAllVoters,
        approveVoter,
        loginVoter,
        registerVoter,

        getAllElections,
        getCandidatesByElection,
        getVoteCountsByElection,
        submitVote,
        updateElectionStatus,
        createVoter,
        loginAdmin,
        createElection,
        createCandidate,
        updateCandidateApproval,
        updateCandidate,
        updateVoter,
        deleteVoter,
        deleteElection,
        deleteCandidate
    };
};