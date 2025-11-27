package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "votes", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "voter_id", "election_id", "post_id" })
})
public class Votes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vote_id")
    private Long voteId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "voter_id", referencedColumnName = "id", nullable = false)
    private Voter voter;

    @ManyToOne(optional = false)
    @JoinColumn(name = "candidate_id", referencedColumnName = "candidate_id", nullable = false)
    private Candidates candidate;

    // Keep the direct relationship with Elections
    @ManyToOne
    @JoinColumn(name = "election_id", referencedColumnName = "id")
    private Elections election;

    private LocalDateTime timestamp;

    // -------------------
    // Getters and Setters
    // -------------------
    public Long getVoteId() {
        return voteId;
    }

    public void setVoteId(Long voteId) {
        this.voteId = voteId;
    }

    public Voter getVoter() {
        return voter;
    }

    public void setVoter(Voter voter) {
        this.voter = voter;
    }

    public Candidates getCandidate() {
        return candidate;
    }

    public void setCandidate(Candidates candidate) {
        this.candidate = candidate;
    }

    public Elections getElection() {
        return election;
    }

    public void setElection(Elections election) {
        this.election = election;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}