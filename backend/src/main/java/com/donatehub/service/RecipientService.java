package com.donatehub.service;

import com.donatehub.dto.common.PageResponse;
import com.donatehub.dto.recipient.RecipientRequest;
import com.donatehub.dto.recipient.RecipientResponse;

import java.util.List;

public interface RecipientService {
    RecipientResponse createRecipient(RecipientRequest request, Long adminId);
    RecipientResponse updateRecipient(Long id, RecipientRequest request, Long adminId);
    RecipientResponse getRecipientById(Long id);
    List<RecipientResponse> getAllRecipients();
    PageResponse<RecipientResponse> searchRecipients(String query, String organizationType, int page, int size);
    void deleteRecipient(Long id, Long adminId);
}
