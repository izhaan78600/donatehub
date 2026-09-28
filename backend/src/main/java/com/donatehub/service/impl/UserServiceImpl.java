package com.donatehub.service.impl;

import com.donatehub.dto.common.PageResponse;
import com.donatehub.dto.donation.DonationResponse;
import com.donatehub.dto.user.UpdateProfileRequest;
import com.donatehub.dto.user.UserDashboardDto;
import com.donatehub.dto.user.UserProfileDto;
import com.donatehub.dto.user.UserSummaryDto;
import com.donatehub.entity.DonatedItem;
import com.donatehub.entity.Donor;
import com.donatehub.entity.User;
import com.donatehub.exception.ResourceNotFoundException;
import com.donatehub.repository.DistributionRepository;
import com.donatehub.repository.DonatedItemRepository;
import com.donatehub.repository.DonationDriveRepository;
import com.donatehub.repository.DonorRepository;
import com.donatehub.repository.UserRepository;
import com.donatehub.service.AuditLogService;
import com.donatehub.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final DonorRepository donorRepository;
    private final DonatedItemRepository donatedItemRepository;
    private final DistributionRepository distributionRepository;
    private final DonationDriveRepository donationDriveRepository;
    private final AuditLogService auditLogService;

    public UserServiceImpl(UserRepository userRepository,
                           DonorRepository donorRepository,
                           DonatedItemRepository donatedItemRepository,
                           DistributionRepository distributionRepository,
                           DonationDriveRepository donationDriveRepository,
                           AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.donorRepository = donorRepository;
        this.donatedItemRepository = donatedItemRepository;
        this.distributionRepository = distributionRepository;
        this.donationDriveRepository = donationDriveRepository;
        this.auditLogService = auditLogService;
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileDto getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return new UserProfileDto(user.getId(), user.getFullName(), user.getEmail(), user.getPhone(), user.getAddress(), user.getRole(), user.getCreatedAt());
    }

    @Override
    @Transactional
    public UserProfileDto updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());

        User updatedUser = userRepository.save(user);

        // Update corresponding donor record if present
        donorRepository.findByUser(user).ifPresent(donor -> {
            donor.setName(updatedUser.getFullName());
            donor.setPhone(updatedUser.getPhone());
            donor.setAddress(updatedUser.getAddress());
            donorRepository.save(donor);
        });

        auditLogService.log(user.getId(), "UPDATE_PROFILE", "USER", user.getId(), "User updated profile");

        return new UserProfileDto(updatedUser.getId(), updatedUser.getFullName(), updatedUser.getEmail(), updatedUser.getPhone(), updatedUser.getAddress(), updatedUser.getRole(), updatedUser.getCreatedAt());
    }

    @Override
    @Transactional(readOnly = true)
    public UserDashboardDto getUserDashboard(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        Donor donor = donorRepository.findByUser(user).orElse(null);
        if (donor == null) {
            long activeDrives = donationDriveRepository.countByStatus("ACTIVE");
            return new UserDashboardDto(user.getFullName(), 0, 0, 0, activeDrives, Collections.emptyList());
        }

        List<DonatedItem> donations = donatedItemRepository.findByDonorIdOrderByCreatedAtDesc(donor.getId());
        long totalDonations = donations.size();
        long itemsDonated = donatedItemRepository.sumTotalQuantityByDonorId(donor.getId());
        long itemsDistributed = distributionRepository.sumDistributedQuantityByDonorId(donor.getId());
        long activeDrives = donationDriveRepository.countByStatus("ACTIVE");

        List<DonationResponse> recentDonations = donations.stream()
                .limit(5)
                .map(this::mapToDonationResponse)
                .collect(Collectors.toList());

        return new UserDashboardDto(user.getFullName(), totalDonations, itemsDonated, itemsDistributed, activeDrives, recentDonations);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<UserSummaryDto> getAllUsers(String query, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<User> users = userRepository.searchUsers(query, pageRequest);

        Page<UserSummaryDto> dtoPage = users.map(u -> new UserSummaryDto(
                u.getId(), u.getFullName(), u.getEmail(), u.getPhone(), u.getAddress(), u.getRole(), u.getCreatedAt()
        ));

        return new PageResponse<>(dtoPage);
    }

    @Override
    @Transactional(readOnly = true)
    public UserSummaryDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return new UserSummaryDto(user.getId(), user.getFullName(), user.getEmail(), user.getPhone(), user.getAddress(), user.getRole(), user.getCreatedAt());
    }

    @Override
    @Transactional
    public void deleteUser(Long id, Long adminId) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        userRepository.delete(user);
        auditLogService.log(adminId, "DELETE", "USER", id, "Admin deleted user: " + user.getEmail());
    }

    private DonationResponse mapToDonationResponse(DonatedItem item) {
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
