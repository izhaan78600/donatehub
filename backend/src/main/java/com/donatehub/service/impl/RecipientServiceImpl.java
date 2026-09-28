package com.donatehub.service.impl;

import com.donatehub.dto.common.PageResponse;
import com.donatehub.dto.recipient.RecipientRequest;
import com.donatehub.dto.recipient.RecipientResponse;
import com.donatehub.entity.Recipient;
import com.donatehub.exception.BadRequestException;
import com.donatehub.exception.ResourceNotFoundException;
import com.donatehub.repository.RecipientRepository;
import com.donatehub.service.AuditLogService;
import com.donatehub.service.RecipientService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecipientServiceImpl implements RecipientService {

    private final RecipientRepository recipientRepository;
    private final AuditLogService auditLogService;

    public RecipientServiceImpl(RecipientRepository recipientRepository, AuditLogService auditLogService) {
        this.recipientRepository = recipientRepository;
        this.auditLogService = auditLogService;
    }

    @Override
    @Transactional
    public RecipientResponse createRecipient(RecipientRequest request, Long adminId) {
        if (recipientRepository.findByEmail(request.getEmail().trim()).isPresent()) {
            throw new BadRequestException("Recipient with email '" + request.getEmail() + "' already exists.");
        }

        Recipient recipient = new Recipient(
                request.getOrganizationName().trim(),
                request.getContactPerson().trim(),
                request.getEmail().trim().toLowerCase(),
                request.getPhone().trim(),
                request.getAddress().trim(),
                request.getOrganizationType().trim()
        );

        Recipient saved = recipientRepository.save(recipient);
        auditLogService.log(adminId, "CREATE", "RECIPIENT", saved.getId(), "Created recipient: " + saved.getOrganizationName());

        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public RecipientResponse updateRecipient(Long id, RecipientRequest request, Long adminId) {
        Recipient recipient = recipientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipient not found with id: " + id));

        String newEmail = request.getEmail().trim().toLowerCase();
        if (!recipient.getEmail().equalsIgnoreCase(newEmail) && recipientRepository.findByEmail(newEmail).isPresent()) {
            throw new BadRequestException("Recipient with email '" + newEmail + "' already exists.");
        }

        recipient.setOrganizationName(request.getOrganizationName().trim());
        recipient.setContactPerson(request.getContactPerson().trim());
        recipient.setEmail(newEmail);
        recipient.setPhone(request.getPhone().trim());
        recipient.setAddress(request.getAddress().trim());
        recipient.setOrganizationType(request.getOrganizationType().trim());

        Recipient updated = recipientRepository.save(recipient);
        auditLogService.log(adminId, "UPDATE", "RECIPIENT", updated.getId(), "Updated recipient: " + updated.getOrganizationName());

        return mapToResponse(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public RecipientResponse getRecipientById(Long id) {
        Recipient recipient = recipientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipient not found with id: " + id));
        return mapToResponse(recipient);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RecipientResponse> getAllRecipients() {
        return recipientRepository.findAll(Sort.by("organizationName")).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<RecipientResponse> searchRecipients(String query, String organizationType, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Recipient> recipients = recipientRepository.searchRecipients(query, organizationType, pageRequest);
        Page<RecipientResponse> dtoPage = recipients.map(this::mapToResponse);
        return new PageResponse<>(dtoPage);
    }

    @Override
    @Transactional
    public void deleteRecipient(Long id, Long adminId) {
        Recipient recipient = recipientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipient not found with id: " + id));

        recipientRepository.delete(recipient);
        auditLogService.log(adminId, "DELETE", "RECIPIENT", id, "Deleted recipient: " + recipient.getOrganizationName());
    }

    private RecipientResponse mapToResponse(Recipient recipient) {
        RecipientResponse res = new RecipientResponse();
        res.setId(recipient.getId());
        res.setOrganizationName(recipient.getOrganizationName());
        res.setContactPerson(recipient.getContactPerson());
        res.setEmail(recipient.getEmail());
        res.setPhone(recipient.getPhone());
        res.setAddress(recipient.getAddress());
        res.setOrganizationType(recipient.getOrganizationType());
        res.setCreatedAt(recipient.getCreatedAt());
        res.setUpdatedAt(recipient.getUpdatedAt());
        return res;
    }
}
