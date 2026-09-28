package com.donatehub.service;

import com.donatehub.dto.common.PageResponse;
import com.donatehub.dto.distribution.DistributionRequest;
import com.donatehub.dto.distribution.DistributionResponse;

public interface DistributionService {
    DistributionResponse recordDistribution(DistributionRequest request, String adminEmail);
    PageResponse<DistributionResponse> searchDistributions(String query, int page, int size);
    DistributionResponse getDistributionById(Long id);
    void deleteDistribution(Long id, Long adminId);
}
