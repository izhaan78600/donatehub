package com.donatehub.service.impl;

import com.donatehub.dto.common.PageResponse;
import com.donatehub.dto.donation.DonationRequest;
import com.donatehub.dto.donation.DonationResponse;
import com.donatehub.dto.donation.UpdateDonationStatusRequest;
import com.donatehub.entity.*;
import com.donatehub.exception.BadRequestException;
import com.donatehub.exception.ResourceNotFoundException;
import com.donatehub.exception.UnauthorizedException;
import com.donatehub.repository.*;
import com.donatehub.service.AuditLogService;
import com.donatehub.service.DonationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DonationServiceImpl implements DonationService {

    private final DonatedItemRepository donatedItemRepository;
    private final DonationDriveRepository donationDriveRepository;
    private final ItemCategoryRepository itemCategoryRepository;
    private final DonorRepository donorRepository;
    private final UserRepository userRepository;
    private final DistributionRepository distributionRepository;
    private final AuditLogService auditLogService;

    public DonationServiceImpl(DonatedItemRepository donatedItemRepository,
                               DonationDriveRepository donationDriveRepository,
                               ItemCategoryRepository itemCategoryRepository,
                               DonorRepository donorRepository,
                               UserRepository userRepository,
                               DistributionRepository distributionRepository,
                               AuditLogService auditLogService) {
        this.donatedItemRepository = donatedItemRepository;
        this.donationDriveRepository = donationDriveRepository;
        this.itemCategoryRepository = itemCategoryRepository;
        this.donorRepository = donorRepository;
        this.userRepository = userRepository;
        this.distributionRepository = distributionRepository;
        this.auditLogService = auditLogService;
    }

    @Override
    @Transactional
    public DonationResponse createDonation(DonationRequest request, String userEmail) {
        if (request.getQuantity() <= 0) {
            throw new BadRequestException("Quantity must be greater than zero.");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        Donor donor = donorRepository.findByUser(user)
                .orElseGet(() -> {
                    Donor newDonor = new Donor(user, user.getFullName(), user.getEmail(), user.getPhone(), user.getAddress());
                    return donorRepository.save(newDonor);
                });

        DonationDrive drive = donationDriveRepository.findById(request.getDriveId())
                .orElseThrow(() -> new ResourceNotFoundException("Donation drive not found with id: " + request.getDriveId()));

        ItemCategory category = itemCategoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Item category not found with id: " + request.getCategoryId()));

        DonatedItem item = new DonatedItem();
        item.setDrive(drive);
        item.setDonor(donor);
        item.setCategory(category);
        item.setItemName(request.getItemName().trim());
        item.setDescription(request.getDescription());
        item.setQuantity(request.getQuantity());
        item.setCondition(request.getCondition().toUpperCase());
        item.setStatus("PENDING");

        DonatedItem saved = donatedItemRepository.save(item);
        auditLogService.log(user.getId(), "CREATE", "DONATION", saved.getId(),
                "User created donation for item: " + saved.getItemName() + " (Qty: " + saved.getQuantity() + ")");

        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DonationResponse> getUserDonations(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        Donor donor = donorRepository.findByUser(user).orElse(null);
        if (donor == null) {
            return List.of();
        }

        return donatedItemRepository.findByDonorIdOrderByCreatedAtDesc(donor.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public DonationResponse getUserDonationById(Long id, String userEmail) {
        DonatedItem item = donatedItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found with id: " + id));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        if (item.getDonor().getUser() == null || !item.getDonor().getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You can only access your own donations.");
        }

        return mapToResponse(item);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<DonationResponse> searchDonations(String query, String status, Long categoryId, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<DonatedItem> items = donatedItemRepository.searchItems(query, status, categoryId, pageRequest);
        Page<DonationResponse> dtoPage = items.map(this::mapToResponse);
        return new PageResponse<>(dtoPage);
    }

    @Override
    @Transactional(readOnly = true)
    public DonationResponse getDonationById(Long id) {
        DonatedItem item = donatedItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found with id: " + id));
        return mapToResponse(item);
    }

    @Override
    @Transactional
    public DonationResponse updateDonationStatus(Long id, UpdateDonationStatusRequest request, Long adminId) {
        DonatedItem item = donatedItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found with id: " + id));

        String newStatus = request.getStatus().toUpperCase();
        item.setStatus(newStatus);
        if ("COLLECTED".equals(newStatus) && item.getCollectionDate() == null) {
            item.setCollectionDate(LocalDate.now());
        }

        DonatedItem updated = donatedItemRepository.save(item);
        auditLogService.log(adminId, "UPDATE_STATUS", "DONATION", updated.getId(),
                "Admin updated donation status to: " + newStatus);

        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteDonation(Long id, Long adminId) {
        DonatedItem item = donatedItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found with id: " + id));

        List<Distribution> dists = distributionRepository.findByItemId(id);
        if (!dists.isEmpty()) {
            throw new BadRequestException("Cannot delete donation with existing distribution records.");
        }

        donatedItemRepository.delete(item);
        auditLogService.log(adminId, "DELETE", "DONATION", id, "Admin deleted donation: " + item.getItemName());
    }

    private DonationResponse mapToResponse(DonatedItem item) {
        DonationResponse res = new DonationResponse();
        res.setId(item.getId());
        res.setDriveId(item.getDrive().getId());
        res.setDriveName(item.getDrive().getName());
        res.setDonorId(item.getDonor().getId());
        res.setDonorName(item.getDonor().getName());
        res.setDonorEmail(item.getDonor().getEmail());
        res.setCategoryId(item.getCategory().getId());
        res.setCategoryName(item.getCategory().getName());
        res.setItemName(item.getItemName());
        res.setDescription(item.getDescription());
        res.setQuantity(item.getQuantity());
        res.setCondition(item.getCondition());
        res.setCollectionDate(item.getCollectionDate());
        res.setStatus(item.getStatus());

        Integer distributed = distributionRepository.sumQuantityByItemId(item.getId());
        if (distributed == null) distributed = 0;
        res.setDistributedQuantity(distributed);
        res.setAvailableQuantity(Math.max(0, item.getQuantity() - distributed));
        res.setCreatedAt(item.getCreatedAt());
        res.setUpdatedAt(item.getUpdatedAt());
        return res;
    }
}
