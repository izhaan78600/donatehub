package com.donatehub.repository;

import com.donatehub.entity.Distribution;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DistributionRepository extends JpaRepository<Distribution, Long> {

    List<Distribution> findByItemId(Long itemId);

    @Query("SELECT COALESCE(SUM(d.quantity), 0) FROM Distribution d WHERE d.item.id = :itemId")
    Integer sumQuantityByItemId(@Param("itemId") Long itemId);

    @Query("SELECT COALESCE(SUM(d.quantity), 0) FROM Distribution d")
    Long sumTotalDistributedQuantity();

    @Query("SELECT COALESCE(SUM(d.quantity), 0) FROM Distribution d WHERE d.item.donor.id = :donorId")
    Long sumDistributedQuantityByDonorId(@Param("donorId") Long donorId);

    @Query("SELECT d FROM Distribution d WHERE " +
           "(:query IS NULL OR :query = '' OR " +
           "LOWER(d.item.itemName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.recipient.organizationName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.distributedBy) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Distribution> searchDistributions(@Param("query") String query, Pageable pageable);

    @Query("SELECT FUNCTION('DATE_FORMAT', d.distributionDate, '%Y-%m'), COUNT(d), COALESCE(SUM(d.quantity), 0) " +
           "FROM Distribution d GROUP BY FUNCTION('DATE_FORMAT', d.distributionDate, '%Y-%m') " +
           "ORDER BY FUNCTION('DATE_FORMAT', d.distributionDate, '%Y-%m') ASC")
    List<Object[]> getMonthlyDistributionStats();
}
