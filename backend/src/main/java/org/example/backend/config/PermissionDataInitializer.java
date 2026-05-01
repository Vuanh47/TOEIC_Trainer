package org.example.backend.config;

import lombok.RequiredArgsConstructor;
import org.example.backend.entity.Permission;
import org.example.backend.enums.UserRole;
import org.example.backend.repository.PermissionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PermissionDataInitializer implements CommandLineRunner {

    private final PermissionRepository permissionRepository;

    @Override
    public void run(String... args) {
        seed("USER", UserRole.USER);
        seed("ADMIN", UserRole.ADMIN);
    }

    private void seed(String code, UserRole role) {
        if (permissionRepository.existsByCode(code)) {
            return;
        }

        Permission permission = new Permission();
        permission.setCode(code);
        permission.setRole(role);
        permissionRepository.save(permission);
    }
}

