package com.donatehub.repository;

import com.donatehub.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    @Query("SELECT a FROM AuditLog a WHERE " +
           "(:query IS NULL OR :query = '' OR " +
           "LOWER(a.action) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(a.entityType) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(a.description) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:entityType IS NULL OR :entityType = '' OR a.entityType = :entityType)")
    Page<AuditLog> searchAuditLogs(
            @Param("query") String query,
            @Param("entityType") String entityType,
            Pageable pageable
    );
}
