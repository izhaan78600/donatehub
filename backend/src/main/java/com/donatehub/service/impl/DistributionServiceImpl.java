package com.donatehub.service.impl;

import com.donatehub.dto.common.PageResponse;
import com.donatehub.dto.distribution.DistributionRequest;
import com.donatehub.dto.distribution.DistributionResponse;
import com.donatehub.entity.Admin;
import com.donatehub.entity.Distribution;
import com.donatehub.entity.DonatedItem;
import com.donatehub.entity.Recipient;
import com.donatehub.exception.BadRequestException;
import com.donatehub.exception.ResourceNotFoundException;
import com.donatehub.repository.AdminRepository;
import com.donatehub.repository.DistributionRepository;
import com.donatehub.repository.DonatedItemRepository;
import com.donatehub.repository.RecipientRepository;
import com.donatehub.service.AuditLogService;
import com.donatehub.service.DistributionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class DistributionServiceImpl implements DistributionService {

    private final DistributionRepository distributionRepository;
    private final DonatedItemRepository donatedItemRepository;
    private final RecipientRepository recipientRepository;
    private final AdminRepository adminRepository;
    private final AuditLogService auditLogService;

    public DistributionServiceImpl(DistributionRepository distributionRepository,
                                  DonatedItemRepository donatedItemRepository,
                                  RecipientRepository recipientRepository,
                                  AdminRepository adminRepository,
                                  AuditLogService auditLogService) {
        this.distributionRepository = distributionRepository;
        this.donatedItemRepository = donatedItemRepository;
        this.recipientRepository = recipientRepository;
        this.adminRepository = adminRepository;
        this.auditLogService = auditLogService;
    }

    @Override
    @Transactional
    public DistributionResponse recordDistribution(DistributionRequest request, String adminEmail) {
        if (request.getQuantity() <= 0) {
            throw new BadRequestException("Quantity must be greater than zero.");
        }

        DonatedItem item = donatedItemRepository.findById(request.getItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Donated item not found with id: " + request.getItemId()));

        Recipient recipient = recipientRepository.findById(request.getRecipientId())
                .orElseThrow(() -> new ResourceNotFoundException("Recipient not found with id: " + request.getRecipientId()));

        Admin admin = adminRepository.findByEmail(adminEmail).orElse(null);

        // Business Rule 1: An item can only be distributed after it is collected.
        if (!"COLLECTED".equalsIgnoreCase(item.getStatus()) && !"DISTRIBUTED".equalsIgnoreCase(item.getStatus())) {
            throw new BadRequestException("Item must be collected before distribution.");
        }

        // Business Rule 2: Distribution quantity cannot exceed available quantity.
        Integer alreadyDistributed = distributionRepository.sumQuantityByItemId(item.getId());
        if (alreadyDistributed == null) alreadyDistributed = 0;
        int availableQuantity = item.getQuantity() - alreadyDistributed;

        if (request.getQuantity() > availableQuantity) {
            throw new BadRequestException("Distribution quantity exceeds available quantity.");
        }

        Distribution distribution = new Distribution();
        distribution.setItem(item);
        distribution.setRecipient(recipient);
        distribution.setQuantity(request.getQuantity());
        distribution.setDistributionDate(request.getDistributionDate() != null ? request.getDistributionDate() : LocalDate.now());
        distribution.setNotes(request.getNotes());
        distribution.setDistributedBy(admin != null ? admin.getName() : adminEmail);
        distribution.setAdmin(admin);

        Distribution saved = distributionRepository.save(distribution);

        // Update item status if all items have been distributed
        int newTotalDistributed = alreadyDistributed + request.getQuantity();
        if (newTotalDistributed >= item.getQuantity()) {
            item.setStatus("DISTRIBUTED");
            donatedItemRepository.save(item);
        }

        Long adminId = admin != null ? admin.getId() : 1L;
        auditLogService.log(adminId, "DISTRIBUTE", "DISTRIBUTION", saved.getId(),
                "Distributed " + saved.getQuantity() + "x '" + item.getItemName() + "' to " + recipient.getOrganizationName());

        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<DistributionResponse> searchDistributions(String query, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Distribution> distributions = distributionRepository.searchDistributions(query, pageRequest);
        Page<DistributionResponse> dtoPage = distributions.map(this::mapToResponse);
        return new PageResponse<>(dtoPage);
    }

    @Override
    @Transactional(readOnly = true)
    public DistributionResponse getDistributionById(Long id) {
        Distribution distribution = distributionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Distribution not found with id: " + id));
        return mapToResponse(distribution);
    }

    @Override
    @Transactional
    public void deleteDistribution(Long id, Long adminId) {
        Distribution distribution = distributionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Distribution not found with id: " + id));

        DonatedItem item = distribution.getItem();
        distributionRepository.delete(distribution);

        // Recheck item status
        Integer currentDistributed = distributionRepository.sumQuantityByItemId(item.getId());
        if (currentDistributed == null) currentDistributed = 0;
        if (currentDistributed < item.getQuantity() && "DISTRIBUTED".equals(item.getStatus())) {
            item.setStatus("COLLECTED");
            donatedItemRepository.save(item);
        }

        auditLogService.log(adminId, "DELETE", "DISTRIBUTION", id, "Admin deleted distribution record #" + id);
    }

    private DistributionResponse mapToResponse(Distribution distribution) {
        DistributionResponse res = new DistributionResponse();
        res.setId(distribution.getId());
        res.setItemId(distribution.getItem().getId());
        res.setItemName(distribution.getItem().getItemName());
        res.setCategoryName(distribution.getItem().getCategory().getName());
        res.setRecipientId(distribution.getRecipient().getId());
        res.setRecipientName(distribution.getRecipient().getOrganizationName());
        res.setQuantity(distribution.getQuantity());
        res.setDistributionDate(distribution.getDistributionDate());
        res.setNotes(distribution.getNotes());
        res.setDistributedBy(distribution.getDistributedBy());
        res.setCreatedAt(distribution.getCreatedAt());
        return res;
    }
}
