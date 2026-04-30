package org.example.backend.repository;

import org.example.backend.entity.Permission;
import org.example.backend.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PermissionRepository extends JpaRepository<Permission, Long> {
    List<Permission> findByRoleOrderByCodeAsc(UserRole role);

    List<Permission> findAllByOrderByRoleAscCodeAsc();

    Optional<Permission> findByCode(String code);

    boolean existsByCode(String code);
}

