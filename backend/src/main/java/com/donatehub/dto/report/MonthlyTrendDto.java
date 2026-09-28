package com.donatehub.dto.report;

public class MonthlyTrendDto {
    private String month;
    private long collectedQuantity;
    private long distributedQuantity;

    public MonthlyTrendDto() {}

    public MonthlyTrendDto(String month, long collectedQuantity, long distributedQuantity) {
        this.month = month;
        this.collectedQuantity = collectedQuantity;
        this.distributedQuantity = distributedQuantity;
    }

    public String getMonth() { return month; }
    public void setMonth(String month) { this.month = month; }

    public long getCollectedQuantity() { return collectedQuantity; }
    public void setCollectedQuantity(long collectedQuantity) { this.collectedQuantity = collectedQuantity; }

    public long getDistributedQuantity() { return distributedQuantity; }
    public void setDistributedQuantity(long distributedQuantity) { this.distributedQuantity = distributedQuantity; }
}
