package com.donatehub.controller;

import com.donatehub.dto.report.ReportSummaryDto;
import com.donatehub.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/reports")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
@Tag(name = "Reports", description = "Admin report metrics and analytics data")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping
    @Operation(summary = "Admin: Get comprehensive donation, distribution, and drive report summary")
    public ResponseEntity<ReportSummaryDto> getReportData() {
        ReportSummaryDto dto = reportService.getReportSummaryData();
        return ResponseEntity.ok(dto);
    }
}
