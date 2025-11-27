package com.example.demo;

import com.example.demo.model.Admins;
import com.example.demo.repository.AdminsRepository;
import com.example.demo.service.AdminsService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	@Bean
	CommandLineRunner initAdminUser(AdminsService adminsService, AdminsRepository adminsRepository,
			PasswordEncoder passwordEncoder) {
		return args -> {
			// Check if admin user already exists
			Admins existingAdmin = adminsRepository.findByUsername("superadmin");
			if (existingAdmin == null) {
				// Create default admin user using the service to ensure proper password hashing
				Admins admin = new Admins();
				admin.setUsername("superadmin");
				admin.setPasswordhash("admin123"); // Plain text password
				admin.setFirstName("Super");
				admin.setLastName("Admin");
				admin.setEmail("admin@example.com");
				admin.setRole(Admins.Role.SuperAdmin);

				// Use the service to create the admin (which will hash the password)
				Admins savedAdmin = adminsService.createAdmin(admin);
				System.out.println("Default admin user created:");
				System.out.println("ID: " + savedAdmin.getAdminId());
				System.out.println("Username: " + savedAdmin.getUsername());
				System.out.println("Password hash: " + savedAdmin.getPasswordhash());
				System.out.println("First name: " + savedAdmin.getFirstName());
				System.out.println("Last name: " + savedAdmin.getLastName());
				System.out.println("Email: " + savedAdmin.getEmail());
				System.out.println("Role: " + savedAdmin.getRole());
			} else {
				System.out.println("Admin user already exists:");
				System.out.println("ID: " + existingAdmin.getAdminId());
				System.out.println("Username: " + existingAdmin.getUsername());
				System.out.println("Password hash: " + existingAdmin.getPasswordhash());
				System.out.println("First name: " + existingAdmin.getFirstName());
				System.out.println("Last name: " + existingAdmin.getLastName());
				System.out.println("Email: " + existingAdmin.getEmail());
				System.out.println("Role: " + existingAdmin.getRole());

				// Let's also test the password verification
				boolean matches = passwordEncoder.matches("admin123", existingAdmin.getPasswordhash());
				System.out.println("Password 'admin123' matches: " + matches);

				// If the password doesn't match, let's update it
				if (!matches) {
					System.out.println("Updating admin password...");
					existingAdmin.setPasswordhash("admin123"); // Plain text password
					Admins updatedAdmin = adminsService.updateAdmin(existingAdmin.getAdminId(), existingAdmin);
					System.out.println("Admin password updated:");
					System.out.println("New password hash: " + updatedAdmin.getPasswordhash());

					// Test the new password
					boolean newMatches = passwordEncoder.matches("admin123", updatedAdmin.getPasswordhash());
					System.out.println("New password 'admin123' matches: " + newMatches);
				}
			}
		};
	}
}