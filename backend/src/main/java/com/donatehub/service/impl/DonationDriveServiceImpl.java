package com.donatehub.service.impl;

import com.donatehub.dto.common.PageResponse;
import com.donatehub.dto.drive.DriveRequest;
import com.donatehub.dto.drive.DriveResponse;
import com.donatehub.entity.DonationDrive;
import com.donatehub.exception.BadRequestException;
import com.donatehub.exception.ResourceNotFoundException;
import com.donatehub.repository.DonatedItemRepository;
import com.donatehub.repository.DonationDriveRepository;
import com.donatehub.service.AuditLogService;
import com.donatehub.service.DonationDriveService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DonationDriveServiceImpl implements DonationDriveService {

    private final DonationDriveRepository driveRepository;
    private final DonatedItemRepository donatedItemRepository;
    private final AuditLogService auditLogService;

    public DonationDriveServiceImpl(DonationDriveRepository driveRepository,
                                   DonatedItemRepository donatedItemRepository,
                                   AuditLogService auditLogService) {
        this.driveRepository = driveRepository;
        this.donatedItemRepository = donatedItemRepository;
        this.auditLogService = auditLogService;
    }

    @Override
    @Transactional
    public DriveResponse createDrive(DriveRequest request, Long adminId) {
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("Drive end date cannot be before start date.");
        }

        DonationDrive drive = new DonationDrive();
        drive.setName(request.getName().trim());
        drive.setDescription(request.getDescription());
        drive.setStartDate(request.getStartDate());
        drive.setEndDate(request.getEndDate());
        drive.setLocation(request.getLocation().trim());
        drive.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");

        DonationDrive saved = driveRepository.save(drive);
        auditLogService.log(adminId, "CREATE", "DRIVE", saved.getId(), "Created drive: " + saved.getName());

        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public DriveResponse updateDrive(Long id, DriveRequest request, Long adminId) {
        DonationDrive drive = driveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donation drive not found with id: " + id));

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("Drive end date cannot be before start date.");
        }

        drive.setName(request.getName().trim());
        drive.setDescription(request.getDescription());
        drive.setStartDate(request.getStartDate());
        drive.setEndDate(request.getEndDate());
        drive.setLocation(request.getLocation().trim());
        if (request.getStatus() != null) {
            drive.setStatus(request.getStatus());
        }

        DonationDrive updated = driveRepository.save(drive);
        auditLogService.log(adminId, "UPDATE", "DRIVE", updated.getId(), "Updated drive: " + updated.getName());

        return mapToResponse(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public DriveResponse getDriveById(Long id) {
        DonationDrive drive = driveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donation drive not found with id: " + id));
        return mapToResponse(drive);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DriveResponse> getActiveDrives() {
        return driveRepository.findByStatus("ACTIVE").stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<DriveResponse> searchDrives(String query, String status, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<DonationDrive> drives = driveRepository.searchDrives(query, status, pageRequest);

        Page<DriveResponse> dtoPage = drives.map(this::mapToResponse);
        return new PageResponse<>(dtoPage);
    }

    @Override
    @Transactional
    public void deleteDrive(Long id, Long adminId) {
        DonationDrive drive = driveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donation drive not found with id: " + id));

        long items = donatedItemRepository.findByDriveId(id).size();
        if (items > 0) {
            throw new BadRequestException("Cannot delete drive with active donated items. Please reassign or delete items first.");
        }

        driveRepository.delete(drive);
        auditLogService.log(adminId, "DELETE", "DRIVE", id, "Deleted drive: " + drive.getName());
    }

    private DriveResponse mapToResponse(DonationDrive drive) {
        DriveResponse res = new DriveResponse();
        res.setId(drive.getId());
        res.setName(drive.getName());
        res.setDescription(drive.getDescription());
        res.setStartDate(drive.getStartDate());
        res.setEndDate(drive.getEndDate());
        res.setLocation(drive.getLocation());
        res.setStatus(drive.getStatus());
        res.setTotalItems(donatedItemRepository.findByDriveId(drive.getId()).size());
        res.setCreatedAt(drive.getCreatedAt());
        res.setUpdatedAt(drive.getUpdatedAt());
        return res;
    }
}
