package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "candidates")
public class Candidates {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "candidate_id")
    @JsonProperty("candidateId")
    private Long candidateId;

    // Foreign key: voter_id references Voter.id
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "voter_id", referencedColumnName = "id", nullable = false)
    @JsonIgnoreProperties({ "passwordHash", "approved" }) // Prevent serialization of sensitive voter data
    private Voter voter;

    // Foreign key: election_id references Elections.id
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "election_id", referencedColumnName = "id", nullable = false)
    @JsonIgnoreProperties({ "description", "start_time", "end_time", "status" }) // Prevent circular references
    private Elections elections;

    @JsonProperty("post")
    private String post; // candidate post/position

    @JsonProperty("bio")
    @Column(length = 500)
    private String bio; // candidate bio

    @JsonProperty("approved")
    private Boolean approved; // tinyint(1) in MySQL

    @JsonProperty("dateRegistered")
    private LocalDateTime dateRegistered; // timestamp

    // -------------------
    // Getters and Setters
    // -------------------
    public Long getCandidateId() {
        return candidateId;
    }

    public void setCandidateId(Long candidateId) {
        this.candidateId = candidateId;
    }

    public Voter getVoter() {
        return voter;
    }

    public void setVoter(Voter voter) {
        this.voter = voter;
    }

    public Elections getElections() {
        return elections;
    }

    public void setElections(Elections election) {
        this.elections = election;
    }

    public String getPost() {
        return post;
    }

    public void setPost(String post) {
        this.post = post;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public Boolean getApproved() {
        return approved;
    }

    public void setApproved(Boolean approved) {
        this.approved = approved;
    }

    public LocalDateTime getDateRegistered() {
        return dateRegistered;
    }

    public void setDateRegistered(LocalDateTime dateRegistered) {
        this.dateRegistered = dateRegistered;
    }
}