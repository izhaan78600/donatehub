package com.donatehub.dto.donation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class UpdateDonationStatusRequest {

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(PENDING|COLLECTED|DISTRIBUTED|CANCELLED)$", message = "Status must be PENDING, COLLECTED, DISTRIBUTED, or CANCELLED")
    private String status;

    public UpdateDonationStatusRequest() {}

    public UpdateDonationStatusRequest(String status) {
        this.status = status;
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
