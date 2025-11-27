package com.example.demo.controller;

import com.example.demo.model.Voter;
import com.example.demo.service.VoterService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/voters") // This is your base path for voter operations
public class VoterController {

    private final VoterService voterService; // Inject the service layer

    // Constructor injection (preferred over field injection)
    public VoterController(VoterService voterService) {
        this.voterService = voterService;
    }

    // GET /api/v1/voters (Retrieves all voters)
    @GetMapping
    public List<Voter> getAllVoters() {
        return voterService.getAllVotersOrdered();
    }

    // POST /api/v1/voters/register
    @PostMapping("/register")
    public Voter registerVoter(@RequestBody Voter voter) {
        return voterService.registerVoter(voter);
    }

    // POST /api/v1/voters/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String firstName = body.get("firstName");
        String lastName = body.get("lastName");
        String email = body.get("email");
        String universityId = body.get("universityId");

        // Validate that all required fields are present
        if (firstName == null || firstName.trim().isEmpty() ||
                lastName == null || lastName.trim().isEmpty() ||
                email == null || email.trim().isEmpty() ||
                universityId == null || universityId.trim().isEmpty()) {
            return new ResponseEntity<>("All fields are required", HttpStatus.BAD_REQUEST);
        }

        Optional<Voter> voterOptional = voterService.getByCredentials(firstName, lastName, email, universityId);
        if (voterOptional.isPresent()) {
            return new ResponseEntity<>(voterOptional.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Invalid credentials or account not found", HttpStatus.NOT_FOUND);
        }
    }

    // PUT /api/v1/voters/{id}/approve
    @PutMapping("/{id}/approve")
    public ResponseEntity<Voter> approve(@PathVariable Long id, @RequestParam(defaultValue = "true") boolean approved) {
        // Calls a service method that you likely already have
        return new ResponseEntity<>(voterService.setApproval(id, approved), HttpStatus.OK);
    }

    // --- NEW ENDPOINT FOR EDITING/UPDATING VOTER DETAILS (ISSUE 3) ---
    // PUT /api/v1/voters/{id}
    @PutMapping("/{id}")
    public ResponseEntity<?> updateVoter(@PathVariable Long id, @RequestBody Voter voterDetails) {
        try {
            // Calls a new service method that we need to implement
            Voter updatedVoter = voterService.updateVoter(id, voterDetails);
            return new ResponseEntity<>(updatedVoter, HttpStatus.OK);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>("Failed to update voter: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // --- NEW ENDPOINT FOR DELETING A VOTER (ISSUE 3) ---
    // DELETE /api/v1/voters/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVoter(@PathVariable Long id) {
        try {
            // Calls a new service method that we need to implement
            voterService.deleteVoter(id);
            return new ResponseEntity<>("Voter with ID " + id + " deleted successfully!", HttpStatus.OK);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>("Failed to delete voter: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}