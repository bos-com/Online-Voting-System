package com.example.demo.repository;

import com.example.demo.model.Candidates;
import com.example.demo.model.Elections;
import com.example.demo.model.Voter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CandidatesRepository extends JpaRepository<Candidates, Long> {
    // Check if a voter is already a candidate in a specific election
    boolean existsByVoterAndElections(Voter voter, Elections elections);

    // Get candidates by election ID - using proper JPA naming convention
    List<Candidates> findByElections_Id(Long electionId);

    // Delete candidates by election ID
    @Query("DELETE FROM Candidates c WHERE c.elections.id = :electionId")
    void deleteByElectionId(@Param("electionId") Long electionId);
}