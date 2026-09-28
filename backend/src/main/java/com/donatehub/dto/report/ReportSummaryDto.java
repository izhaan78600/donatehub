package com.donatehub.dto.report;

import java.util.List;

public class ReportSummaryDto {
    private long totalDonations;
    private long totalItems;
    private long totalDistributed;
    private long totalAvailable;
    private List<CategoryStatDto> donationsByCategory;
    private List<MonthlyTrendDto> monthlyTrends;
    private List<DriveStatDto> drivePerformance;

    public ReportSummaryDto() {}

    public long getTotalDonations() { return totalDonations; }
    public void setTotalDonations(long totalDonations) { this.totalDonations = totalDonations; }

    public long getTotalItems() { return totalItems; }
    public void setTotalItems(long totalItems) { this.totalItems = totalItems; }

    public long getTotalDistributed() { return totalDistributed; }
    public void setTotalDistributed(long totalDistributed) { this.totalDistributed = totalDistributed; }

    public long getTotalAvailable() { return totalAvailable; }
    public void setTotalAvailable(long totalAvailable) { this.totalAvailable = totalAvailable; }

    public List<CategoryStatDto> getDonationsByCategory() { return donationsByCategory; }
    public void setDonationsByCategory(List<CategoryStatDto> donationsByCategory) { this.donationsByCategory = donationsByCategory; }

    public List<MonthlyTrendDto> getMonthlyTrends() { return monthlyTrends; }
    public void setMonthlyTrends(List<MonthlyTrendDto> monthlyTrends) { this.monthlyTrends = monthlyTrends; }

    public List<DriveStatDto> getDrivePerformance() { return drivePerformance; }
    public void setDrivePerformance(List<DriveStatDto> drivePerformance) { this.drivePerformance = drivePerformance; }
}
