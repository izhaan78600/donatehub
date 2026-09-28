package com.donatehub.service;

import com.donatehub.dto.admin.AdminDashboardDto;
import com.donatehub.dto.report.ReportSummaryDto;

public interface ReportService {
    AdminDashboardDto getAdminDashboardData();
    ReportSummaryDto getReportSummaryData();
}
