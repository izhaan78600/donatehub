package com.donatehub.dto.user;

import com.donatehub.dto.donation.DonationResponse;
import java.util.List;

public class UserDashboardDto {
    private String name;
    private long totalDonations;
    private long itemsDonated;
    private long itemsDistributed;
    private long activeDrives;
    private List<DonationResponse> recentDonations;

    public UserDashboardDto() {}

    public UserDashboardDto(String name, long totalDonations, long itemsDonated, long itemsDistributed, long activeDrives, List<DonationResponse> recentDonations) {
        this.name = name;
        this.totalDonations = totalDonations;
        this.itemsDonated = itemsDonated;
        this.itemsDistributed = itemsDistributed;
        this.activeDrives = activeDrives;
        this.recentDonations = recentDonations;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public long getTotalDonations() { return totalDonations; }
    public void setTotalDonations(long totalDonations) { this.totalDonations = totalDonations; }

    public long getItemsDonated() { return itemsDonated; }
    public void setItemsDonated(long itemsDonated) { this.itemsDonated = itemsDonated; }

    public long getItemsDistributed() { return itemsDistributed; }
    public void setItemsDistributed(long itemsDistributed) { this.itemsDistributed = itemsDistributed; }

    public long getActiveDrives() { return activeDrives; }
    public void setActiveDrives(long activeDrives) { this.activeDrives = activeDrives; }

    public List<DonationResponse> getRecentDonations() { return recentDonations; }
    public void setRecentDonations(List<DonationResponse> recentDonations) { this.recentDonations = recentDonations; }
}
