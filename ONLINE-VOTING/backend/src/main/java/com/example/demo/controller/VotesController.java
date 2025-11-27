package com.example.demo.controller;

import com.example.demo.model.Votes;
import com.example.demo.service.VotesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/votes")
public class VotesController {

    @Autowired
    private VotesService votesService;

    @GetMapping
    public List<Votes> getAllVotes() {
        return votesService.getAllVotes();
    }

    @GetMapping("/{id}")
    public Optional<Votes> getVoteById(@PathVariable Long id) {
        return votesService.getVoteById(id);
    }

    @GetMapping("/election/{electionId}/count")
    public List<Object[]> countVotesByElection(@PathVariable Long electionId) {
        return votesService.countVotesByElection(electionId);
    }

    @PostMapping
    public Votes castVote(@RequestBody Votes vote) {
        return votesService.castVote(vote);
    }

    @DeleteMapping("/{id}")
    public String deleteVote(@PathVariable Long id) {
        votesService.deleteVote(id);
        return "Vote with vote_id " + id + " deleted successfully!";
    }

}