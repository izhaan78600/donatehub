package com.donatehub.controller;

import com.donatehub.dto.audit.AuditLogDto;
import com.donatehub.dto.common.PageResponse;
import com.donatehub.service.AuditLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/audit-logs")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
@Tag(name = "Audit Logs", description = "Admin endpoints for viewing system audit history")
public class AuditLogController {

    private final AuditLogService auditLogService;

    public AuditLogController(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    @GetMapping
    @Operation(summary = "Admin: Search and view audit trail logs")
    public ResponseEntity<PageResponse<AuditLogDto>> getAuditLogs(
            @RequestParam(required = false, defaultValue = "") String query,
            @RequestParam(required = false) String entityType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        PageResponse<AuditLogDto> logs = auditLogService.searchAuditLogs(query, entityType, page, size);
        return ResponseEntity.ok(logs);
    }
}
