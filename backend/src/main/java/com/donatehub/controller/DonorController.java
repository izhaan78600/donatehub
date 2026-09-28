package com.donatehub.controller;

import com.donatehub.dto.common.PageResponse;
import com.donatehub.dto.donor.DonorResponse;
import com.donatehub.service.DonorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/donors")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
@Tag(name = "Donors", description = "Admin endpoints for viewing donors")
public class DonorController {

    private final DonorService donorService;

    public DonorController(DonorService donorService) {
        this.donorService = donorService;
    }

    @GetMapping
    @Operation(summary = "Admin: Search donors with pagination")
    public ResponseEntity<PageResponse<DonorResponse>> searchDonors(
            @RequestParam(required = false, defaultValue = "") String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageResponse<DonorResponse> response = donorService.searchDonors(query, page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Admin: Get donor details by ID")
    public ResponseEntity<DonorResponse> getDonorById(@PathVariable Long id) {
        DonorResponse donor = donorService.getDonorById(id);
        return ResponseEntity.ok(donor);
    }
}
