package com.donatehub.service;

import com.donatehub.dto.category.CategoryRequest;
import com.donatehub.dto.category.CategoryResponse;
import com.donatehub.dto.common.PageResponse;

import java.util.List;

public interface CategoryService {
    CategoryResponse createCategory(CategoryRequest request, Long adminId);
    CategoryResponse updateCategory(Long id, CategoryRequest request, Long adminId);
    CategoryResponse getCategoryById(Long id);
    List<CategoryResponse> getAllCategories();
    PageResponse<CategoryResponse> searchCategories(String query, int page, int size);
    void deleteCategory(Long id, Long adminId);
}
