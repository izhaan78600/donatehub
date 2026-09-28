package com.donatehub.service;

import com.donatehub.dto.audit.AuditLogDto;
import com.donatehub.dto.common.PageResponse;

public interface AuditLogService {
    void log(Long userId, String action, String entityType, Long entityId, String description);
    PageResponse<AuditLogDto> searchAuditLogs(String query, String entityType, int page, int size);
}
