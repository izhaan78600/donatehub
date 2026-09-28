package com.donatehub.dto.admin;

import com.donatehub.dto.donation.DonationResponse;
import com.donatehub.dto.report.CategoryStatDto;
import com.donatehub.dto.report.MonthlyTrendDto;

import java.util.List;

public class AdminDashboardDto {
    private long totalUsers;
    private long totalDonationDrives;
    private long activeDrives;
    private long completedDrives;
    private long totalItemsCollected;
    private long totalItemsDistributed;
    private long availableItems;
    private long totalRecipients;
    private List<CategoryStatDto> donationsByCategory;
    private List<MonthlyTrendDto> donationsByMonth;
    private List<DonationResponse> recentActivity;

    public AdminDashboardDto() {}

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalDonationDrives() { return totalDonationDrives; }
    public void setTotalDonationDrives(long totalDonationDrives) { this.totalDonationDrives = totalDonationDrives; }

    public long getActiveDrives() { return activeDrives; }
    public void setActiveDrives(long activeDrives) { this.activeDrives = activeDrives; }

    public long getCompletedDrives() { return completedDrives; }
    public void setCompletedDrives(long completedDrives) { this.completedDrives = completedDrives; }

    public long getTotalItemsCollected() { return totalItemsCollected; }
    public void setTotalItemsCollected(long totalItemsCollected) { this.totalItemsCollected = totalItemsCollected; }

    public long getTotalItemsDistributed() { return totalItemsDistributed; }
    public void setTotalItemsDistributed(long totalItemsDistributed) { this.totalItemsDistributed = totalItemsDistributed; }

    public long getAvailableItems() { return availableItems; }
    public void setAvailableItems(long availableItems) { this.availableItems = availableItems; }

    public long getTotalRecipients() { return totalRecipients; }
    public void setTotalRecipients(long totalRecipients) { this.totalRecipients = totalRecipients; }

    public List<CategoryStatDto> getDonationsByCategory() { return donationsByCategory; }
    public void setDonationsByCategory(List<CategoryStatDto> donationsByCategory) { this.donationsByCategory = donationsByCategory; }

    public List<MonthlyTrendDto> getDonationsByMonth() { return donationsByMonth; }
    public void setDonationsByMonth(List<MonthlyTrendDto> donationsByMonth) { this.donationsByMonth = donationsByMonth; }

    public List<DonationResponse> getRecentActivity() { return recentActivity; }
    public void setRecentActivity(List<DonationResponse> recentActivity) { this.recentActivity = recentActivity; }
}
