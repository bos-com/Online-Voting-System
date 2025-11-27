package com.example.demo.service;

import com.example.demo.model.Voter;
import com.example.demo.repository.VoterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VoterService {

    @Autowired
    private VoterRepository voterRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /*
     * Saves a new Voter to the database using the plaintext password.
     */
    public Voter registerVoter(Voter voter) {
        // 1. Get the plaintext password
        String plaintextPassword = voter.getPasswordHash();

        // 2. HASH THE PASSWORD using the injected PasswordEncoder
        String hashedPassword = passwordEncoder.encode(plaintextPassword);

        // 3. Store the HASHED password back into the voter object
        voter.setPasswordHash(hashedPassword);
        voter.setApproved(true); // Voters registered by admin can log in immediately

        // 4. Save the secured voter object to the database
        return voterRepository.save(voter);
    }

    // --- NEW METHOD FOR UPDATING VOTER (ISSUE 3) ---
    public Voter updateVoter(Long id, Voter voterDetails) {
        if (id == null) {
            throw new IllegalArgumentException("Voter ID cannot be null for update");
        }
        if (voterDetails == null) {
            throw new IllegalArgumentException("Voter details cannot be null");
        }

        try {
            Voter existingVoter = voterRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Voter not found with ID: " + id));

            // Update required fields
            existingVoter.setFirstName(voterDetails.getFirstName());
            existingVoter.setLastName(voterDetails.getLastName());
            existingVoter.setEmail(voterDetails.getEmail());
            existingVoter.setUniversityId(voterDetails.getUniversityId());

            // ** SECURITY CRITICAL: Handle Password Update **
            // The frontend should send the plaintext password in 'passwordHash' only if
            // it's changing.
            String newPassword = voterDetails.getPasswordHash();
            if (newPassword != null && !newPassword.trim().isEmpty()) {
                // Hash the new plaintext password before saving
                String hashedPassword = passwordEncoder.encode(newPassword);
                existingVoter.setPasswordHash(hashedPassword);
            }
            // Note: If newPassword is null/empty, the existing hash remains untouched.

            return voterRepository.save(existingVoter);
        } catch (RuntimeException e) {
            throw e; // Re-throw 'Voter not found'
        } catch (Exception e) {
            System.err.println("Error updating voter with ID " + id + ": " + e.getMessage());
            throw new RuntimeException("Failed to update voter: " + e.getMessage(), e);
        }
    }

    // --- NEW METHOD FOR DELETING VOTER (ISSUE 3) ---
    public void deleteVoter(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Voter ID must not be null");
        }

        try {
            // Check existence and throw a specific error if not found (better UX/API
            // response)
            if (!voterRepository.existsById(id)) {
                throw new RuntimeException("Voter not found with ID: " + id);
            }
            voterRepository.deleteById(id);
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            System.err.println("Error deleting voter with ID " + id + ": " + e.getMessage());
            throw new RuntimeException("Failed to delete voter: " + e.getMessage(), e);
        }
    }

    // ... rest of the methods remain the same ...
    public List<Voter> getAllVotersOrdered() {
        return voterRepository.findAllByOrderByIdAsc();
    }

    public Optional<Voter> getByFirstNameAndEmail(String firstName, String email) {
        return Optional.ofNullable(voterRepository.findByFirstNameAndEmail(firstName, email));
    }

    public Optional<Voter> getByCredentials(String firstName, String lastName, String email,
            String universityId) {
        // Find by university ID (unique identifier)
        Voter voter = voterRepository.findByUniversityId(universityId);

        if (voter != null &&
                voter.getFirstName().trim().equalsIgnoreCase(firstName.trim()) &&
                voter.getLastName().trim().equalsIgnoreCase(lastName.trim()) &&
                voter.getEmail().trim().equalsIgnoreCase(email.trim())) {
            return Optional.of(voter);
        }

        return Optional.empty();
    }

    public Voter setApproval(Long id, boolean approved) {
        if (id == null) {
            throw new IllegalArgumentException("Voter ID must not be null");
        }

        Voter v = voterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Voter not found: " + id));
        v.setApproved(approved);
        return voterRepository.save(v);
    }
}