package com.donatehub.controller;

import com.donatehub.dto.common.ApiResponse;
import com.donatehub.dto.common.PageResponse;
import com.donatehub.dto.user.UpdateProfileRequest;
import com.donatehub.dto.user.UserDashboardDto;
import com.donatehub.dto.user.UserProfileDto;
import com.donatehub.dto.user.UserSummaryDto;
import com.donatehub.security.UserPrincipal;
import com.donatehub.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "User Management", description = "Endpoints for user profile, user dashboard, and admin user management")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/api/user/profile")
    @Operation(summary = "Get current user profile")
    public ResponseEntity<UserProfileDto> getProfile(@AuthenticationPrincipal UserPrincipal currentUser) {
        UserProfileDto profile = userService.getProfile(currentUser.getUsername());
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/api/user/profile")
    @Operation(summary = "Update current user profile")
    public ResponseEntity<UserProfileDto> updateProfile(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody UpdateProfileRequest request) {
        UserProfileDto updated = userService.updateProfile(currentUser.getUsername(), request);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/api/user/dashboard")
    @Operation(summary = "Get user dashboard statistics and recent donations")
    public ResponseEntity<UserDashboardDto> getUserDashboard(@AuthenticationPrincipal UserPrincipal currentUser) {
        UserDashboardDto dashboard = userService.getUserDashboard(currentUser.getUsername());
        return ResponseEntity.ok(dashboard);
    }

    // ADMIN USER MANAGEMENT ENDPOINTS
    @GetMapping("/api/admin/users")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Get all users with search and pagination")
    public ResponseEntity<PageResponse<UserSummaryDto>> getAllUsers(
            @RequestParam(required = false, defaultValue = "") String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageResponse<UserSummaryDto> users = userService.getAllUsers(query, page, size);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/api/admin/users/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Get user details by ID")
    public ResponseEntity<UserSummaryDto> getUserById(@PathVariable Long id) {
        UserSummaryDto user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/api/admin/users/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Delete user by ID")
    public ResponseEntity<ApiResponse> deleteUser(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        userService.deleteUser(id, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse(true, "User deleted successfully"));
    }
}
