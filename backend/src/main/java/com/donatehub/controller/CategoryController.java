package com.donatehub.controller;

import com.donatehub.dto.category.CategoryRequest;
import com.donatehub.dto.category.CategoryResponse;
import com.donatehub.dto.common.ApiResponse;
import com.donatehub.dto.common.PageResponse;
import com.donatehub.security.UserPrincipal;
import com.donatehub.service.CategoryService;
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
@Tag(name = "Item Categories", description = "Endpoints for donation item categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping("/api/categories")
    @Operation(summary = "Get all categories (public/dropdown)")
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        List<CategoryResponse> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/api/admin/categories")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Search categories with pagination")
    public ResponseEntity<PageResponse<CategoryResponse>> searchCategories(
            @RequestParam(required = false, defaultValue = "") String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageResponse<CategoryResponse> response = categoryService.searchCategories(query, page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/admin/categories/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Get category by ID")
    public ResponseEntity<CategoryResponse> getCategoryById(@PathVariable Long id) {
        CategoryResponse category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(category);
    }

    @PostMapping("/api/admin/categories")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Create a new category")
    public ResponseEntity<CategoryResponse> createCategory(
            @Valid @RequestBody CategoryRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        CategoryResponse created = categoryService.createCategory(request, currentUser.getId());
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/api/admin/categories/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Update an existing category")
    public ResponseEntity<CategoryResponse> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        CategoryResponse updated = categoryService.updateCategory(id, request, currentUser.getId());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/api/admin/categories/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Delete category by ID")
    public ResponseEntity<ApiResponse> deleteCategory(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        categoryService.deleteCategory(id, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse(true, "Category deleted successfully"));
    }
}
