package com.example.demo.controller;

import com.example.demo.model.Admins;
import com.example.demo.service.AdminsService;
import com.example.demo.repository.AdminsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/admins")
public class AdminsController {

    @Autowired
    private AdminsService adminsService;

    @Autowired
    private AdminsRepository adminsRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Temporary test endpoint to check admin credentials
    @GetMapping("/test")
    public ResponseEntity<?> testAdmin() {
        Admins admin = adminsRepository.findByUsername("superadmin");
        if (admin != null) {
            boolean matches = passwordEncoder.matches("admin123", admin.getPasswordhash());
            return ResponseEntity.ok("Admin found. Password matches: " + matches +
                    ". Stored hash: " + admin.getPasswordhash() +
                    ". Provided password: admin123");
        } else {
            return ResponseEntity.ok("Admin not found");
        }
    }

    // Another test endpoint to create an admin user manually
    @PostMapping("/create-test-admin")
    public ResponseEntity<?> createTestAdmin() {
        // Check if admin already exists
        if (adminsRepository.findByUsername("superadmin") != null) {
            return ResponseEntity.ok("Admin already exists");
        }

        // Create a new admin
        Admins admin = new Admins();
        admin.setUsername("superadmin");
        admin.setPasswordhash(passwordEncoder.encode("admin123"));
        admin.setFirstName("Super");
        admin.setLastName("Admin");
        admin.setEmail("admin@example.com");
        admin.setRole(Admins.Role.SuperAdmin);

        Admins savedAdmin = adminsRepository.save(admin);
        return ResponseEntity.ok("Test admin created with ID: " + savedAdmin.getAdminId());
    }

    @GetMapping
    public List<Admins> getAllAdmins() {
        return adminsService.getAllAdmins();
    }

    @GetMapping("/{id}")
    public Optional<Admins> getAdminById(@PathVariable Long id) {
        return adminsService.getAdminById(id);
    }

    // Admin login endpoint
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        // Validate that all required fields are present
        if (username == null || username.trim().isEmpty() ||
                password == null || password.trim().isEmpty()) {
            return new ResponseEntity<>("Username and password are required", HttpStatus.BAD_REQUEST);
        }

        System.out.println("Login attempt - Username: " + username + ", Password: " + password);

        Optional<Admins> adminOptional = adminsService.getByCredentials(username, password);

        System.out.println("Admin found: " + adminOptional.isPresent());
        if (adminOptional.isPresent()) {
            System.out.println("Admin details - ID: " + adminOptional.get().getAdminId() +
                    ", Username: " + adminOptional.get().getUsername());
        }

        if (adminOptional.isPresent()) {
            return new ResponseEntity<>(adminOptional.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping
    public Admins createAdmin(@RequestBody Admins admin) {
        return adminsService.createAdmin(admin);
    }

    @PutMapping("/{id}")
    public Admins updateAdmin(@PathVariable Long id, @RequestBody Admins adminDetails) {
        return adminsService.updateAdmin(id, adminDetails);
    }

    @DeleteMapping("/{id}")
    public String deleteAdmin(@PathVariable Long id) {
        adminsService.deleteAdmin(id);
        return "Admin with admin_id " + id + " deleted successfully!";
    }
}