package com.donatehub.service;

import com.donatehub.dto.common.PageResponse;
import com.donatehub.dto.donor.DonorResponse;

public interface DonorService {
    PageResponse<DonorResponse> searchDonors(String query, int page, int size);
    DonorResponse getDonorById(Long id);
}
