package com.example.demo.service;

import com.example.demo.model.Candidates;
import com.example.demo.model.Elections;
import com.example.demo.repository.CandidatesRepository;
import com.example.demo.repository.ElectionsRepository;
import com.example.demo.repository.VotesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ElectionsService {

    @Autowired
    private ElectionsRepository electionsRepository;

    @Autowired
    private CandidatesRepository candidatesRepository;

    @Autowired
    private VotesRepository votesRepository;

    // Get all elections (excluding deleted ones)
    public List<Elections> getAllElections() {
        try {
            // Return only non-deleted elections
            return electionsRepository.findByDeletedFalse();
        } catch (Exception e) {
            System.err.println("Error retrieving elections: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to retrieve elections: " + e.getMessage(), e);
        }
    }

    // Get election by ID
    public Optional<Elections> getElectionById(Long Id) {
        if (Id == null) {
            throw new IllegalArgumentException("Election ID cannot be null");
        }
        try {
            return electionsRepository.findById(Id);
        } catch (Exception e) {
            System.err.println("Error retrieving election with ID " + Id + ": " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to retrieve election: " + e.getMessage(), e);
        }
    }

    // Create a new election
    public Elections createElection(Elections election) {
        if (election == null) {
            throw new IllegalArgumentException("Election cannot be null");
        }
        try {
            return electionsRepository.save(election);
        } catch (Exception e) {
            System.err.println("Error creating election: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create election: " + e.getMessage(), e);
        }
    }

    public Elections updateElectionStatus(Long id, String newStatus) {
        if (id == null) {
            throw new IllegalArgumentException("Election ID cannot be null");
        }
        if (newStatus == null || newStatus.trim().isEmpty()) {
            throw new IllegalArgumentException("New status cannot be null or empty");
        }

        try {
            // 1. Find the election in the database
            Elections election = electionsRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Election not found with ID " + id));

            // 2. Set ONLY the status field to the new value
            election.setStatus(newStatus.toLowerCase()); // Convert to lowercase for consistency

            // 3. Save the updated election back to the database
            return electionsRepository.save(election);
        } catch (RuntimeException e) {
            // Re-throw if the election wasn't found
            throw e;
        } catch (Exception e) {
            System.err.println("Error updating status for election with ID " + id + ": " + e.getMessage());
            throw new RuntimeException("Failed to update election status: " + e.getMessage(), e);
        }
    }

    // Update an existing election
    public Elections updateElections(Long Id, Elections electionsDetails) {
        if (Id == null) {
            throw new IllegalArgumentException("Election ID cannot be null");
        }
        if (electionsDetails == null) {
            throw new IllegalArgumentException("Election details cannot be null");
        }

        try {
            Elections elections = electionsRepository.findById(Id)
                    .orElseThrow(() -> new RuntimeException("Election not found with electionId " + Id));

            elections.setName(electionsDetails.getName());
            elections.setDescription(electionsDetails.getDescription());
            elections.setStart_time(electionsDetails.getStart_time());
            elections.setEnd_time(electionsDetails.getEnd_time());
            elections.setStatus(electionsDetails.getStatus());

            return electionsRepository.save(elections); // Fixed: was incorrectly saving electionsDetails
        } catch (Exception e) {
            System.err.println("Error updating election with ID " + Id + ": " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to update election: " + e.getMessage(), e);
        }
    }

    // Delete an election (soft delete) with cascade deletion of candidates and
    // votes
    public void deleteElections(Long Id) {
        if (Id == null) {
            throw new IllegalArgumentException("Election ID cannot be null");
        }
        try {
            System.out.println("Attempting to delete election with ID: " + Id);

            // Find all candidates for this election
            List<Candidates> candidates = candidatesRepository.findByElections_Id(Id);

            // Delete all votes and candidates for this election
            for (Candidates candidate : candidates) {
                // Delete all votes for this candidate
                votesRepository.deleteByCandidateId(candidate.getCandidateId());

                // Delete the candidate
                candidatesRepository.delete(candidate);
            }

            // Mark the election as deleted
            Elections election = electionsRepository.findById(Id)
                    .orElseThrow(() -> new RuntimeException("Election not found with ID " + Id));

            election.setDeleted(true);
            electionsRepository.save(election);

            System.out.println("Successfully deleted election with ID " + Id + " and all related candidates and votes");
        } catch (Exception e) {
            System.err.println("Error deleting election with ID " + Id + ": " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to delete election: " + e.getMessage(), e);
        }
    }
}