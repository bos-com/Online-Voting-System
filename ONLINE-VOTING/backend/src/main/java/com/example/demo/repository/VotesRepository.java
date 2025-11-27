package com.example.demo.repository;

import com.example.demo.model.Votes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VotesRepository extends JpaRepository<Votes, Long> {

    boolean existsByVoterIdAndElectionId(Long voterId, Long electionId);

    // Method to check if a voter has already voted for a specific post in an
    // election
    @Query("SELECT COUNT(v) > 0 FROM Votes v WHERE v.voter.id = :voterId AND v.election.id = :electionId AND v.candidate.post = :post")
    boolean existsByVoterIdAndElectionIdAndCandidatePost(@Param("voterId") Long voterId,
            @Param("electionId") Long electionId, @Param("post") String post);

    // CRITICAL FIX: Changed v.elections.electionId to v.election.id
    @Query("SELECT v.candidate, COUNT(v) FROM Votes v WHERE v.election.id = :electionId GROUP BY v.candidate.post, v.candidate.candidateId")
    List<Object[]> countVotesByElection(@Param("electionId") Long electionId);

    // CRITICAL FIX: Changed findByElection_Id to findByElection_id
    List<Votes> findByElection_id(Long electionId);

    // Delete votes by election ID
    @Modifying
    @Query("DELETE FROM Votes v WHERE v.election.id = :electionId")
    void deleteByElectionId(@Param("electionId") Long electionId);

    // Method to find votes by candidate ID
    @Query("SELECT v FROM Votes v WHERE v.candidate.candidateId = :candidateId")
    List<Votes> findByCandidateId(@Param("candidateId") Long candidateId);

    // Method to delete votes by candidate ID
    @Modifying
    @Query("DELETE FROM Votes v WHERE v.candidate.candidateId = :candidateId")
    void deleteByCandidateId(@Param("candidateId") Long candidateId);
}