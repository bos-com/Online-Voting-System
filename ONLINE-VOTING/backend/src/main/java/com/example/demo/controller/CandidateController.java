package com.example.demo.controller;

import com.example.demo.model.Candidates;
import com.example.demo.service.CandidatesService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/candidates")
public class CandidateController {

    private final CandidatesService candidateService;

    public CandidateController(CandidatesService candidateService) {
        this.candidateService = candidateService;
    }

    @GetMapping
    public List<Candidates> getAllCandidates() {
        return candidateService.getAllCandidates();
    }

    @GetMapping("/{id}")
    public Optional<Candidates> getCandidateById(@PathVariable Long id) {
        return candidateService.getCandidateById(id);
    }

    @GetMapping("/election/{electionId}")
    public List<Candidates> getCandidatesByElection(@PathVariable Long electionId) {
        return candidateService.getCandidatesByElection(electionId);
    }

    @PostMapping
    public Candidates addCandidate(@RequestBody Candidates candidate) {
        System.out.println("=== INCOMING CANDIDATE REQUEST ===");
        System.out.println("Request body: " + candidate);
        if (candidate != null) {
            System.out.println("Voter: " + (candidate.getVoter() != null ? candidate.getVoter().getId() : "null"));
            System.out.println(
                    "Election: " + (candidate.getElections() != null ? candidate.getElections().getId() : "null"));
            System.out.println("Post: " + candidate.getPost());
            System.out.println("Bio: " + candidate.getBio());
        }
        System.out.println("==================================");

        Candidates result = candidateService.addCandidates(candidate);

        System.out.println("=== RESPONSE ===");
        System.out.println("Saved candidate ID: " + (result != null ? result.getCandidateId() : "null"));
        System.out.println("===============");

        return result;
    }

    @PutMapping("/{id}")
    public Candidates updateCandidate(@PathVariable Long id, @RequestBody Candidates candidateDetails) {
        return candidateService.updateCandidates(id, candidateDetails);
    }

    @DeleteMapping("/{id}")
    public String deleteCandidates(@PathVariable Long id) {
        candidateService.deleteCandidate(id);
        return "Candidate with candidate_id " + id + " deleted successfully!";
    }
}