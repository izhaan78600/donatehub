package com.donatehub.controller;

import com.donatehub.dto.common.ApiResponse;
import com.donatehub.dto.common.PageResponse;
import com.donatehub.dto.drive.DriveRequest;
import com.donatehub.dto.drive.DriveResponse;
import com.donatehub.security.UserPrincipal;
import com.donatehub.service.DonationDriveService;
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
@Tag(name = "Donation Drives", description = "Endpoints for viewing and managing donation drives")
public class DriveController {

    private final DonationDriveService driveService;

    public DriveController(DonationDriveService driveService) {
        this.driveService = driveService;
    }

    // Public / User endpoints
    @GetMapping("/api/drives")
    @Operation(summary = "Get all active donation drives")
    public ResponseEntity<List<DriveResponse>> getActiveDrives() {
        List<DriveResponse> drives = driveService.getActiveDrives();
        return ResponseEntity.ok(drives);
    }

    @GetMapping("/api/drives/{id}")
    @Operation(summary = "Get donation drive by ID")
    public ResponseEntity<DriveResponse> getDriveById(@PathVariable Long id) {
        DriveResponse drive = driveService.getDriveById(id);
        return ResponseEntity.ok(drive);
    }

    // Admin endpoints
    @GetMapping("/api/admin/drives")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Search drives with status filter and pagination")
    public ResponseEntity<PageResponse<DriveResponse>> searchDrives(
            @RequestParam(required = false, defaultValue = "") String query,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageResponse<DriveResponse> response = driveService.searchDrives(query, status, page, size);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/api/admin/drives")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Create a new donation drive")
    public ResponseEntity<DriveResponse> createDrive(
            @Valid @RequestBody DriveRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        DriveResponse created = driveService.createDrive(request, currentUser.getId());
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/api/admin/drives/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Get drive details by ID")
    public ResponseEntity<DriveResponse> getAdminDriveById(@PathVariable Long id) {
        DriveResponse drive = driveService.getDriveById(id);
        return ResponseEntity.ok(drive);
    }

    @PutMapping("/api/admin/drives/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Update donation drive")
    public ResponseEntity<DriveResponse> updateDrive(
            @PathVariable Long id,
            @Valid @RequestBody DriveRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        DriveResponse updated = driveService.updateDrive(id, request, currentUser.getId());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/api/admin/drives/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Delete donation drive")
    public ResponseEntity<ApiResponse> deleteDrive(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        driveService.deleteDrive(id, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse(true, "Donation drive deleted successfully"));
    }
}
