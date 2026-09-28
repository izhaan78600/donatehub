package com.donatehub.dto.recipient;

import java.time.LocalDateTime;

public class RecipientResponse {
    private Long id;
    private String organizationName;
    private String contactPerson;
    private String email;
    private String phone;
    private String address;
    private String organizationType;
    private long totalDistributionsReceived;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public RecipientResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOrganizationName() { return organizationName; }
    public void setOrganizationName(String organizationName) { this.organizationName = organizationName; }

    public String getContactPerson() { return contactPerson; }
    public void setContactPerson(String contactPerson) { this.contactPerson = contactPerson; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getOrganizationType() { return organizationType; }
    public void setOrganizationType(String organizationType) { this.organizationType = organizationType; }

    public long getTotalDistributionsReceived() { return totalDistributionsReceived; }
    public void setTotalDistributionsReceived(long totalDistributionsReceived) { this.totalDistributionsReceived = totalDistributionsReceived; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
