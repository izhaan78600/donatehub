package com.donatehub.dto.report;

public class CategoryStatDto {
    private String categoryName;
    private long donationCount;
    private long totalQuantity;

    public CategoryStatDto() {}

    public CategoryStatDto(String categoryName, long donationCount, long totalQuantity) {
        this.categoryName = categoryName;
        this.donationCount = donationCount;
        this.totalQuantity = totalQuantity;
    }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public long getDonationCount() { return donationCount; }
    public void setDonationCount(long donationCount) { this.donationCount = donationCount; }

    public long getTotalQuantity() { return totalQuantity; }
    public void setTotalQuantity(long totalQuantity) { this.totalQuantity = totalQuantity; }
}
