package com.example.demo.repository;

import com.example.demo.model.Elections;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ElectionsRepository extends JpaRepository<Elections, Long> {
    // Only ElectionsRepository code here

    // Method to find all non-deleted elections
    List<Elections> findByDeletedFalse();
}