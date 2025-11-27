package com.example.demo.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
public class Voter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @JsonProperty("id")
    private Long id;

    private String firstName;
    private String lastName;

    // Critical: Ensures no two voters can have the same email
    @Column(unique = true)
    private String email;

    // Critical: Ensures no two voters can have the same university ID
    @Column(unique = true)
    private String universityId;
    // private String department;

    // Stores the secure BCrypt hash of the password
    private String passwordHash;
    private Boolean approved;

    // Constructors
    public Voter() {
    }

    public Voter(String firstName, String lastName, String email, String universityId, String department,
            String passwordHash) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        // this.department = department;
        this.universityId = universityId;
        this.passwordHash = passwordHash;
    }

    // Getters and Setters (REQUIRED by JPA/Jackson)

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUniversityId() {
        return universityId;
    }

    public void setUniversityId(String universityId) {
        this.universityId = universityId;
    }

    /*
     * public String getDepartment() {
     * return department;
     * }
     * 
     * public void setDepartment(String department) {
     * this.department = department;
     * }
     */

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public Boolean getApproved() {
        return approved;
    }

    public void setApproved(Boolean approved) {
        this.approved = approved;
    }

}