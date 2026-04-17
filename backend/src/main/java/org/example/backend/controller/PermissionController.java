package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.entity.Permission;
import org.example.backend.repository.PermissionRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin/permissions")
@RequiredArgsConstructor
public class PermissionController {

    private final PermissionRepository permissionRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Permission> getAllPermissions() {
        return permissionRepository.findAllByOrderByRoleAscCodeAsc();
    }
}

