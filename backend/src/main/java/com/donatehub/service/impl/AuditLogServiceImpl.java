package com.donatehub.service.impl;

import com.donatehub.dto.audit.AuditLogDto;
import com.donatehub.dto.common.PageResponse;
import com.donatehub.entity.AuditLog;
import com.donatehub.repository.AuditLogRepository;
import com.donatehub.service.AuditLogService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogServiceImpl(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Override
    @Transactional
    public void log(Long userId, String action, String entityType, Long entityId, String description) {
        AuditLog auditLog = new AuditLog(userId, action, entityType, entityId, description);
        auditLogRepository.save(auditLog);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<AuditLogDto> searchAuditLogs(String query, String entityType, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<AuditLog> auditLogs = auditLogRepository.searchAuditLogs(query, entityType, pageRequest);

        Page<AuditLogDto> dtoPage = auditLogs.map(log -> new AuditLogDto(
                log.getId(),
                log.getUserId(),
                log.getAction(),
                log.getEntityType(),
                log.getEntityId(),
                log.getDescription(),
                log.getCreatedAt()
        ));

        return new PageResponse<>(dtoPage);
    }
}
