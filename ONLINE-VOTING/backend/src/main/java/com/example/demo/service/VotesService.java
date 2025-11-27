package com.example.demo.service;

import com.example.demo.model.Elections;
import com.example.demo.model.Votes;
import com.example.demo.repository.VotesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class VotesService {

    @Autowired
    private VotesRepository votesRepository;

    // Cast a vote
    public Votes castVote(Votes vote) {
        // Handle potential null objects
        if (vote.getVoter() == null || vote.getCandidate() == null) {
            throw new IllegalArgumentException("Voter and Candidate must not be null");
        }

        Long voterId = vote.getVoter().getId();
        // Get election ID from the candidate and set it in the vote
        Elections election = vote.getCandidate().getElections();
        vote.setElection(election);
        Long electionId = election.getId();
        Long candidateId = vote.getCandidate().getCandidateId();

        // Handle potential null IDs
        if (voterId == null || electionId == null || candidateId == null) {
            throw new IllegalArgumentException("Voter ID, Election ID, and Candidate ID must not be null");
        }

        // Get the candidate's post
        String post = vote.getCandidate().getPost();
        if (post == null || post.trim().isEmpty()) {
            throw new IllegalArgumentException("Candidate must have a valid post");
        }

        // Ensure voter hasn't voted for this post in this election
        if (votesRepository.existsByVoterIdAndElectionIdAndCandidatePost(voterId, electionId, post)) {
            throw new RuntimeException("Voter has already voted for the position '" + post + "' in this election");
        }

        vote.setTimestamp(LocalDateTime.now());
        return votesRepository.save(vote);
    }

    // Get all votes
    public List<Votes> getAllVotes() {
        return votesRepository.findAll();
    }

    // Get vote by ID
    public Optional<Votes> getVoteById(Long voteId) {
        // Handle potential null input
        if (voteId == null) {
            return Optional.empty();
        }
        return votesRepository.findById(voteId);
    }

    // Delete a vote
    public void deleteVote(Long voteId) {
        // Handle potential null input
        if (voteId == null) {
            throw new IllegalArgumentException("Vote ID must not be null");
        }
        votesRepository.deleteById(voteId);
    }

    // Count votes per candidate for a specific election
    public List<Object[]> countVotesByElection(Long electionId) {
        // Handle potential null input
        if (electionId == null) {
            throw new IllegalArgumentException("Election ID must not be null");
        }
        return votesRepository.countVotesByElection(electionId);
    }

    // Get all votes for a specific election
    public List<Votes> getVotesByElection(Long electionId) {
        // Handle potential null input
        if (electionId == null) {
            throw new IllegalArgumentException("Election ID must not be null");
        }
        return votesRepository.findByElection_id(electionId);
    }

    // Delete votes by candidate ID
    public void deleteByCandidateId(Long candidateId) {
        // Handle potential null input
        if (candidateId == null) {
            throw new IllegalArgumentException("Candidate ID must not be null");
        }
        // Delete votes by candidate ID directly
        votesRepository.deleteByCandidateId(candidateId);
    }
}