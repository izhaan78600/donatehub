package com.donatehub.repository;

import com.donatehub.entity.DonatedItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonatedItemRepository extends JpaRepository<DonatedItem, Long> {

    List<DonatedItem> findByDonorIdOrderByCreatedAtDesc(Long donorId);
    Page<DonatedItem> findByDonorIdOrderByCreatedAtDesc(Long donorId, Pageable pageable);

    List<DonatedItem> findByDriveId(Long driveId);

    @Query("SELECT d FROM DonatedItem d WHERE " +
           "(:query IS NULL OR :query = '' OR " +
           "LOWER(d.itemName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.donor.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.drive.name) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:status IS NULL OR :status = '' OR d.status = :status) AND " +
           "(:categoryId IS NULL OR d.category.id = :categoryId)")
    Page<DonatedItem> searchItems(
            @Param("query") String query,
            @Param("status") String status,
            @Param("categoryId") Long categoryId,
            Pageable pageable
    );

    @Query("SELECT COALESCE(SUM(d.quantity), 0) FROM DonatedItem d")
    Long sumTotalQuantity();

    @Query("SELECT COALESCE(SUM(d.quantity), 0) FROM DonatedItem d WHERE d.donor.id = :donorId")
    Long sumTotalQuantityByDonorId(@Param("donorId") Long donorId);

    @Query("SELECT d.category.name, COUNT(d), COALESCE(SUM(d.quantity), 0) " +
           "FROM DonatedItem d GROUP BY d.category.name")
    List<Object[]> getDonationsByCategory();

    @Query("SELECT d.status, COUNT(d), COALESCE(SUM(d.quantity), 0) " +
           "FROM DonatedItem d GROUP BY d.status")
    List<Object[]> getDonationsByStatus();
}
