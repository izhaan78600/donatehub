package com.donatehub.controller;

import com.donatehub.dto.admin.AdminDashboardDto;
import com.donatehub.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
@Tag(name = "Admin Dashboard", description = "Admin dashboard metrics, charts data, and recent activity")
public class AdminDashboardController {

    private final ReportService reportService;

    public AdminDashboardController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping
    @Operation(summary = "Admin: Get complete dashboard statistics, charts data, and activity")
    public ResponseEntity<AdminDashboardDto> getDashboardData() {
        AdminDashboardDto dto = reportService.getAdminDashboardData();
        return ResponseEntity.ok(dto);
    }
}
