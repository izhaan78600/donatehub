package com.donatehub.controller;

import com.donatehub.dto.common.ApiResponse;
import com.donatehub.dto.common.PageResponse;
import com.donatehub.dto.recipient.RecipientRequest;
import com.donatehub.dto.recipient.RecipientResponse;
import com.donatehub.security.UserPrincipal;
import com.donatehub.service.RecipientService;
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
@RequestMapping("/api/admin/recipients")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
@Tag(name = "Recipients", description = "Admin endpoints for recipient organizations management")
public class RecipientController {

    private final RecipientService recipientService;

    public RecipientController(RecipientService recipientService) {
        this.recipientService = recipientService;
    }

    @GetMapping
    @Operation(summary = "Admin: Search recipients with filters and pagination")
    public ResponseEntity<PageResponse<RecipientResponse>> searchRecipients(
            @RequestParam(required = false, defaultValue = "") String query,
            @RequestParam(required = false) String organizationType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageResponse<RecipientResponse> response = recipientService.searchRecipients(query, organizationType, page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    @Operation(summary = "Admin: Get all recipients list for distribution dropdown")
    public ResponseEntity<List<RecipientResponse>> getAllRecipients() {
        List<RecipientResponse> list = recipientService.getAllRecipients();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Admin: Get recipient details by ID")
    public ResponseEntity<RecipientResponse> getRecipientById(@PathVariable Long id) {
        RecipientResponse recipient = recipientService.getRecipientById(id);
        return ResponseEntity.ok(recipient);
    }

    @PostMapping
    @Operation(summary = "Admin: Create a new recipient organization")
    public ResponseEntity<RecipientResponse> createRecipient(
            @Valid @RequestBody RecipientRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        RecipientResponse created = recipientService.createRecipient(request, currentUser.getId());
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Admin: Update recipient organization")
    public ResponseEntity<RecipientResponse> updateRecipient(
            @PathVariable Long id,
            @Valid @RequestBody RecipientRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        RecipientResponse updated = recipientService.updateRecipient(id, request, currentUser.getId());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Admin: Delete recipient organization")
    public ResponseEntity<ApiResponse> deleteRecipient(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        recipientService.deleteRecipient(id, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse(true, "Recipient deleted successfully"));
    }
}
