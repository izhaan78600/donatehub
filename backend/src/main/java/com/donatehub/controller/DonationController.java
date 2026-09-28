package com.donatehub.controller;

import com.donatehub.dto.common.ApiResponse;
import com.donatehub.dto.common.PageResponse;
import com.donatehub.dto.donation.DonationRequest;
import com.donatehub.dto.donation.DonationResponse;
import com.donatehub.dto.donation.UpdateDonationStatusRequest;
import com.donatehub.security.UserPrincipal;
import com.donatehub.service.DonationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Tag(name = "Donations", description = "Endpoints for creating and managing item donations")
public class DonationController {

    private final DonationService donationService;

    public DonationController(DonationService donationService) {
        this.donationService = donationService;
    }

    // USER ENDPOINTS
    @PostMapping("/api/user/donations")
    @Operation(summary = "User: Donate items to a drive")
    public ResponseEntity<DonationResponse> createDonation(
            @Valid @RequestBody DonationRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        DonationResponse response = donationService.createDonation(request, currentUser.getUsername());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/api/user/donations")
    @Operation(summary = "User: View all personal donations")
    public ResponseEntity<List<DonationResponse>> getUserDonations(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<DonationResponse> donations = donationService.getUserDonations(currentUser.getUsername());
        return ResponseEntity.ok(donations);
    }

    @GetMapping("/api/user/donations/{id}")
    @Operation(summary = "User: View details and track status of a specific donation")
    public ResponseEntity<DonationResponse> getUserDonationById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        DonationResponse donation = donationService.getUserDonationById(id, currentUser.getUsername());
        return ResponseEntity.ok(donation);
    }

    // ADMIN ENDPOINTS
    @GetMapping("/api/admin/donations")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Search donations with filters and pagination")
    public ResponseEntity<PageResponse<DonationResponse>> searchDonations(
            @RequestParam(required = false, defaultValue = "") String query,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageResponse<DonationResponse> response = donationService.searchDonations(query, status, categoryId, page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/admin/donations/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Get donation details by ID")
    public ResponseEntity<DonationResponse> getDonationById(@PathVariable Long id) {
        DonationResponse donation = donationService.getDonationById(id);
        return ResponseEntity.ok(donation);
    }

    @PutMapping("/api/admin/donations/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Update donation status (COLLECTED, CANCELLED, etc.)")
    public ResponseEntity<DonationResponse> updateDonationStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateDonationStatusRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        DonationResponse response = donationService.updateDonationStatus(id, request, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/api/admin/donations/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Delete donation by ID")
    public ResponseEntity<ApiResponse> deleteDonation(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        donationService.deleteDonation(id, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse(true, "Donation deleted successfully"));
    }
}
