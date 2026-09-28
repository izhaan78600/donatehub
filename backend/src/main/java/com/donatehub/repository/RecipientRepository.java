package com.donatehub.repository;

import com.donatehub.entity.Recipient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RecipientRepository extends JpaRepository<Recipient, Long> {
    Optional<Recipient> findByEmail(String email);

    @Query("SELECT r FROM Recipient r WHERE " +
           "(:query IS NULL OR :query = '' OR " +
           "LOWER(r.organizationName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(r.contactPerson) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(r.email) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:organizationType IS NULL OR :organizationType = '' OR r.organizationType = :organizationType)")
    Page<Recipient> searchRecipients(
            @Param("query") String query,
            @Param("organizationType") String organizationType,
            Pageable pageable
    );
}
