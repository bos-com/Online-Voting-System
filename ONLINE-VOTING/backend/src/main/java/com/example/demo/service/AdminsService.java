package com.example.demo.service;

import com.example.demo.model.Admins;
import com.example.demo.repository.AdminsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminsService {

    @Autowired
    private AdminsRepository adminsRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // CRITICAL FIX: Inject PasswordEncoder

    // REMOVED: private static final String FIXED_USERNAME = "superadmin";

    // Create new admin
    public Admins createAdmin(Admins admin) {
        // HASHING FIX: Hash the password before saving
        String hashedPassword = passwordEncoder.encode(admin.getPasswordhash());
        admin.setPasswordhash(hashedPassword);

        // Ensure email is unique (already handled by existsByEmail)
        if (adminsRepository.existsByEmail(admin.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Logical check for username uniqueness (if not enforced by DB)
        // If you were checking for username uniqueness, you'd add:
        // if (adminsRepository.existsByUsername(admin.getUsername())) { ... }

        return adminsRepository.save(admin);
    }

    // Get all admins
    public List<Admins> getAllAdmins() {
        return adminsRepository.findAll();
    }

    // Get admin by ID
    public Optional<Admins> getAdminById(Long admin_id) {
        // Handle potential null input
        if (admin_id == null) {
            return Optional.empty();
        }
        return adminsRepository.findById(admin_id);
    }

    // Verify admin credentials
    public Optional<Admins> getByCredentials(String username, String password) {
        // Find admin by username
        // Note: This would require adding a method to AdminsRepository
        Admins admin = adminsRepository.findByUsername(username);

        System.out.println("Looking for admin with username: " + username);
        System.out.println("Admin found: " + (admin != null));
        if (admin != null) {
            System.out.println("Stored password hash: " + admin.getPasswordhash());
            System.out.println("Provided password: " + password);

            boolean passwordMatches = passwordEncoder.matches(password, admin.getPasswordhash());
            System.out.println("Password matches: " + passwordMatches);

            // If admin exists and password matches
            if (passwordMatches) {
                return Optional.of(admin);
            }
        }

        return Optional.empty();
    }

    // Update admin
    public Admins updateAdmin(Long admin_id, Admins adminDetails) {
        // Validate input parameters
        if (admin_id == null || adminDetails == null) {
            throw new IllegalArgumentException("Admin ID and admin details must not be null");
        }

        Admins admin = adminsRepository.findById(admin_id)
                .orElseThrow(() -> new RuntimeException("Admin not found with admin_id " + admin_id));

        // SECURITY FIX: Only update the password if a new one is provided AND hash it
        if (adminDetails.getPasswordhash() != null && !adminDetails.getPasswordhash().isEmpty()) {
            String newHashedPassword = passwordEncoder.encode(adminDetails.getPasswordhash());
            admin.setPasswordhash(newHashedPassword);
        }

        // Admin ID and Username should generally not be changed during an update.
        // We only allow updates to fields provided in adminDetails

        admin.setFirstName(adminDetails.getFirstName());
        admin.setLastName(adminDetails.getLastName());
        admin.setEmail(adminDetails.getEmail());
        admin.setRole(adminDetails.getRole());

        // NOTE: If username is part of adminDetails, you should validate it for
        // uniqueness.
        admin.setUsername(adminDetails.getUsername());

        return adminsRepository.save(admin);
    }

    // Delete admin
    public void deleteAdmin(Long id) {
        // Handle potential null input
        if (id == null) {
            throw new IllegalArgumentException("Admin ID must not be null");
        }
        adminsRepository.deleteById(id);
    }
}