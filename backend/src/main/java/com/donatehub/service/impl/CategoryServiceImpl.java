package com.donatehub.service.impl;

import com.donatehub.dto.category.CategoryRequest;
import com.donatehub.dto.category.CategoryResponse;
import com.donatehub.dto.common.PageResponse;
import com.donatehub.entity.ItemCategory;
import com.donatehub.exception.BadRequestException;
import com.donatehub.exception.ResourceNotFoundException;
import com.donatehub.repository.ItemCategoryRepository;
import com.donatehub.service.AuditLogService;
import com.donatehub.service.CategoryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final ItemCategoryRepository categoryRepository;
    private final AuditLogService auditLogService;

    public CategoryServiceImpl(ItemCategoryRepository categoryRepository, AuditLogService auditLogService) {
        this.categoryRepository = categoryRepository;
        this.auditLogService = auditLogService;
    }

    @Override
    @Transactional
    public CategoryResponse createCategory(CategoryRequest request, Long adminId) {
        if (categoryRepository.existsByName(request.getName().trim())) {
            throw new BadRequestException("Category with name '" + request.getName() + "' already exists.");
        }

        ItemCategory category = new ItemCategory(request.getName().trim(), request.getDescription());
        ItemCategory saved = categoryRepository.save(category);
        auditLogService.log(adminId, "CREATE", "CATEGORY", saved.getId(), "Created category: " + saved.getName());

        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request, Long adminId) {
        ItemCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        String newName = request.getName().trim();
        if (!category.getName().equalsIgnoreCase(newName) && categoryRepository.existsByName(newName)) {
            throw new BadRequestException("Category with name '" + newName + "' already exists.");
        }

        category.setName(newName);
        category.setDescription(request.getDescription());

        ItemCategory updated = categoryRepository.save(category);
        auditLogService.log(adminId, "UPDATE", "CATEGORY", updated.getId(), "Updated category: " + updated.getName());

        return mapToResponse(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Long id) {
        ItemCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return mapToResponse(category);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll(Sort.by("name")).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<CategoryResponse> searchCategories(String query, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("name"));
        Page<ItemCategory> categories = categoryRepository.searchCategories(query, pageRequest);
        Page<CategoryResponse> dtoPage = categories.map(this::mapToResponse);
        return new PageResponse<>(dtoPage);
    }

    @Override
    @Transactional
    public void deleteCategory(Long id, Long adminId) {
        ItemCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        categoryRepository.delete(category);
        auditLogService.log(adminId, "DELETE", "CATEGORY", id, "Deleted category: " + category.getName());
    }

    private CategoryResponse mapToResponse(ItemCategory category) {
        CategoryResponse res = new CategoryResponse();
        res.setId(category.getId());
        res.setName(category.getName());
        res.setDescription(category.getDescription());
        res.setCreatedAt(category.getCreatedAt());
        res.setUpdatedAt(category.getUpdatedAt());
        return res;
    }
}
