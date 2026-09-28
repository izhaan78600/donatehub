package com.donatehub.controller;

import com.donatehub.dto.common.ApiResponse;
import com.donatehub.dto.common.PageResponse;
import com.donatehub.dto.distribution.DistributionRequest;
import com.donatehub.dto.distribution.DistributionResponse;
import com.donatehub.security.UserPrincipal;
import com.donatehub.service.DistributionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/distributions")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
@Tag(name = "Distributions", description = "Admin endpoints for recording and tracking item distributions")
public class DistributionController {

    private final DistributionService distributionService;

    public DistributionController(DistributionService distributionService) {
        this.distributionService = distributionService;
    }

    @GetMapping
    @Operation(summary = "Admin: Search distributions with pagination")
    public ResponseEntity<PageResponse<DistributionResponse>> searchDistributions(
            @RequestParam(required = false, defaultValue = "") String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageResponse<DistributionResponse> response = distributionService.searchDistributions(query, page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Admin: Get distribution details by ID")
    public ResponseEntity<DistributionResponse> getDistributionById(@PathVariable Long id) {
        DistributionResponse response = distributionService.getDistributionById(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @Operation(summary = "Admin: Record distribution of an item to a recipient")
    public ResponseEntity<DistributionResponse> recordDistribution(
            @Valid @RequestBody DistributionRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        DistributionResponse created = distributionService.recordDistribution(request, currentUser.getUsername());
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Admin: Delete distribution record by ID")
    public ResponseEntity<ApiResponse> deleteDistribution(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        distributionService.deleteDistribution(id, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse(true, "Distribution deleted successfully"));
    }
}
