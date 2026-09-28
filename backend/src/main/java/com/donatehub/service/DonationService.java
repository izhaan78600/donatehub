package com.donatehub.service;

import com.donatehub.dto.common.PageResponse;
import com.donatehub.dto.donation.DonationRequest;
import com.donatehub.dto.donation.DonationResponse;
import com.donatehub.dto.donation.UpdateDonationStatusRequest;

import java.util.List;

public interface DonationService {
    DonationResponse createDonation(DonationRequest request, String userEmail);
    List<DonationResponse> getUserDonations(String userEmail);
    DonationResponse getUserDonationById(Long id, String userEmail);
    PageResponse<DonationResponse> searchDonations(String query, String status, Long categoryId, int page, int size);
    DonationResponse getDonationById(Long id);
    DonationResponse updateDonationStatus(Long id, UpdateDonationStatusRequest request, Long adminId);
    void deleteDonation(Long id, Long adminId);
}
