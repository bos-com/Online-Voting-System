package com.example.demo.repository;

import com.example.demo.model.Admins;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminsRepository extends JpaRepository<Admins, Long> {
    boolean existsByEmail(String email);

    Admins findByUsername(String username);
}