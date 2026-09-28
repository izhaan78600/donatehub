package com.donatehub.service;

import com.donatehub.dto.common.PageResponse;
import com.donatehub.dto.user.UpdateProfileRequest;
import com.donatehub.dto.user.UserDashboardDto;
import com.donatehub.dto.user.UserProfileDto;
import com.donatehub.dto.user.UserSummaryDto;

public interface UserService {
    UserProfileDto getProfile(String email);
    UserProfileDto updateProfile(String email, UpdateProfileRequest request);
    UserDashboardDto getUserDashboard(String email);
    PageResponse<UserSummaryDto> getAllUsers(String query, int page, int size);
    UserSummaryDto getUserById(Long id);
    void deleteUser(Long id, Long adminId);
}
