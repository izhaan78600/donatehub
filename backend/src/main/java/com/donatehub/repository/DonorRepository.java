package com.donatehub.repository;

import com.donatehub.entity.Donor;
import com.donatehub.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DonorRepository extends JpaRepository<Donor, Long> {
    Optional<Donor> findByUser(User user);
    Optional<Donor> findByUserId(Long userId);
    Optional<Donor> findByEmail(String email);

    @Query("SELECT d FROM Donor d WHERE " +
           "(:query IS NULL OR :query = '' OR " +
           "LOWER(d.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.email) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.phone) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Donor> searchDonors(@Param("query") String query, Pageable pageable);
}
