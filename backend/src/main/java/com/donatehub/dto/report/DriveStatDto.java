package com.donatehub.dto.report;

public class DriveStatDto {
    private Long driveId;
    private String driveName;
    private String status;
    private long totalItems;
    private long totalDistributed;
    private long totalAvailable;

    public DriveStatDto() {}

    public DriveStatDto(Long driveId, String driveName, String status, long totalItems, long totalDistributed, long totalAvailable) {
        this.driveId = driveId;
        this.driveName = driveName;
        this.status = status;
        this.totalItems = totalItems;
        this.totalDistributed = totalDistributed;
        this.totalAvailable = totalAvailable;
    }

    public Long getDriveId() { return driveId; }
    public void setDriveId(Long driveId) { this.driveId = driveId; }

    public String getDriveName() { return driveName; }
    public void setDriveName(String driveName) { this.driveName = driveName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public long getTotalItems() { return totalItems; }
    public void setTotalItems(long totalItems) { this.totalItems = totalItems; }

    public long getTotalDistributed() { return totalDistributed; }
    public void setTotalDistributed(long totalDistributed) { this.totalDistributed = totalDistributed; }

    public long getTotalAvailable() { return totalAvailable; }
    public void setTotalAvailable(long totalAvailable) { this.totalAvailable = totalAvailable; }
}
