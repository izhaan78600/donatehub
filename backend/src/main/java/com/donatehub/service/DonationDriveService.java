package com.donatehub.service;

import com.donatehub.dto.common.PageResponse;
import com.donatehub.dto.drive.DriveRequest;
import com.donatehub.dto.drive.DriveResponse;

import java.util.List;

public interface DonationDriveService {
    DriveResponse createDrive(DriveRequest request, Long adminId);
    DriveResponse updateDrive(Long id, DriveRequest request, Long adminId);
    DriveResponse getDriveById(Long id);
    List<DriveResponse> getActiveDrives();
    PageResponse<DriveResponse> searchDrives(String query, String status, int page, int size);
    void deleteDrive(Long id, Long adminId);
}
