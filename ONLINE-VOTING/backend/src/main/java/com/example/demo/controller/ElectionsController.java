package com.example.demo.controller;

import com.example.demo.model.Elections;
import com.example.demo.service.ElectionsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/elections")
public class ElectionsController {

    @Autowired
    private ElectionsService electionsService;

    @GetMapping
    public ResponseEntity<?> getAllElections() {
        try {
            List<Elections> elections = electionsService.getAllElections();
            System.out.println("Retrieved elections: " + elections.size());
            return new ResponseEntity<>(elections, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("Error retrieving elections: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>("Failed to retrieve elections: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    public ResponseEntity<?> createElection(@RequestBody Elections election) {
        try {
            System.out.println("Received election data: " + election);
            Elections createdElection = electionsService.createElection(election);
            return new ResponseEntity<>(createdElection, HttpStatus.CREATED);
        } catch (Exception e) {
            System.err.println("Error creating election: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>("Failed to create election: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateElections(@PathVariable Long id, @RequestBody Elections electionsDetails) {
        try {
            Elections updatedElection = electionsService.updateElections(id, electionsDetails);
            return new ResponseEntity<>(updatedElection, HttpStatus.OK);
        } catch (RuntimeException e) {
            System.err.println("Error updating election with ID " + id + ": " + e.getMessage());
            e.printStackTrace();
            if (e.getMessage().contains("not found")) {
                return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>("Failed to update election: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            System.err.println("Unexpected error updating election with ID " + id + ": " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>("Failed to update election: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}/status") // Maps to /api/v1/elections/{id}/status
    public ResponseEntity<?> updateElectionStatus(@PathVariable Long id,
            @RequestBody java.util.Map<String, String> statusUpdate) {
        try {
            // We expect the request body to be {"status": "active"}
            String newStatus = statusUpdate.get("status");
            if (newStatus == null || newStatus.trim().isEmpty()) {
                return new ResponseEntity<>("New status must be provided.", HttpStatus.BAD_REQUEST);
            }

            // Call the service method implemented in Step 1
            Elections updatedElection = electionsService.updateElectionStatus(id, newStatus);

            return new ResponseEntity<>(updatedElection, HttpStatus.OK);
        } catch (RuntimeException e) {
            // Handle "not found" or other runtime exceptions
            if (e.getMessage().contains("not found")) {
                return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>("Failed to update status: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteElection(@PathVariable Long id) {
        try {
            electionsService.deleteElections(id);
            return new ResponseEntity<>("Election with ID " + id + " deleted successfully!", HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("Error deleting election with ID " + id + ": " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>("Failed to delete election: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}