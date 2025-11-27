package com.example.demo.service;

import com.example.demo.model.Candidates;
import com.example.demo.model.Elections;
import com.example.demo.model.Voter;
import com.example.demo.repository.CandidatesRepository;
import com.example.demo.repository.VoterRepository;
import com.example.demo.repository.ElectionsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CandidatesService {

    @Autowired
    private CandidatesRepository candidatesRepository;

    @Autowired
    private VoterRepository voterRepository;

    @Autowired
    private ElectionsRepository electionsRepository;

    @Autowired
    private VotesService votesService;

    // Create a new candidate
    public Candidates addCandidates(Candidates candidates) {
        try {
            System.out.println("Received candidate data: " + candidates);

            // Log the specific fields
            if (candidates.getVoter() != null) {
                System.out.println("Voter ID: " + candidates.getVoter().getId());
            }
            if (candidates.getElections() != null) {
                System.out.println("Election ID: " + candidates.getElections().getId());
            }
            System.out.println("Post: " + candidates.getPost());
            System.out.println("Bio: " + candidates.getBio());

            candidates.setDateRegistered(java.time.LocalDateTime.now());
            candidates.setApproved(false);

            System.out.println("About to save candidate...");
            Candidates saved = candidatesRepository.save(candidates);
            System.out.println("Candidate saved successfully with ID: " + saved.getCandidateId());

            return saved;
        } catch (Exception e) {
            System.err.println("=== CANDIDATE CREATION ERROR ===");
            System.err.println("Error type: " + e.getClass().getName());
            System.err.println("Error message: " + e.getMessage());
            System.err.println("Stack trace:");
            e.printStackTrace();
            System.err.println("================================");
            throw new RuntimeException("Failed to create candidate: " + e.getMessage(), e);
        }
    }

    // Get all candidates
    public List<Candidates> getAllCandidates() {
        return candidatesRepository.findAll();
    }

    // Get candidate by ID
    public Optional<Candidates> getCandidateById(@NonNull Long candidateId) {
        return candidatesRepository.findById(candidateId);
    }

    // Get candidates by election ID
    public List<Candidates> getCandidatesByElection(@NonNull Long electionId) {
        return candidatesRepository.findByElections_Id(electionId);
    }

    // Update candidate
    public Candidates updateCandidates(@NonNull Long candidateId, Candidates candidatesDetails) {
        if (candidatesDetails == null) {
            throw new IllegalArgumentException("Candidate details must not be null");
        }

        Candidates candidate = candidatesRepository.findById(candidateId)
                .orElseThrow(() -> new IllegalArgumentException("Candidate not found with candidateId " + candidateId));

        candidate.setPost(candidatesDetails.getPost());
        candidate.setBio(candidatesDetails.getBio());
        candidate.setApproved(candidatesDetails.getApproved());

        // Only update voter and election if provided
        if (candidatesDetails.getVoter() != null && candidatesDetails.getVoter().getId() != null) {
            Voter voter = voterRepository.findById(candidatesDetails.getVoter().getId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Voter not found with ID: " + candidatesDetails.getVoter().getId()));
            candidate.setVoter(voter);
        }

        if (candidatesDetails.getElections() != null && candidatesDetails.getElections().getId() != null) {
            Elections election = electionsRepository.findById(candidatesDetails.getElections().getId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Election not found with ID: " + candidatesDetails.getElections().getId()));
            candidate.setElections(election);
        }

        return candidatesRepository.save(candidate);
    }

    // Delete candidate
    public void deleteCandidate(@NonNull Long candidateId) {
        // First delete all votes associated with this candidate to avoid foreign key
        // constraint violations
        votesService.deleteByCandidateId(candidateId);

        // Then delete the candidate
        candidatesRepository.deleteById(candidateId);
    }
}
