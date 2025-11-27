package com.example.demo.repository;

import com.example.demo.model.Voter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository // Marks this as a Repository component
public interface VoterRepository extends JpaRepository<Voter, Long> {
    // Spring automatically provides methods like save(), findById(), etc.
    // No code is needed inside the interface body
    // Custom method to find a voter by email (useful for login)
    Voter findByEmail(String email);

    Voter findByFirstNameAndEmail(String firstName, String email);

    Voter findByUniversityId(String universityId);

    List<Voter> findAllByOrderByIdAsc();

}