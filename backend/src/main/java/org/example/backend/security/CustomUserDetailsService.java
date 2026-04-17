package org.example.backend.security;

import lombok.RequiredArgsConstructor;
import org.example.backend.entity.Permission;
import org.example.backend.entity.User;
import org.example.backend.enums.UserRole;
import org.example.backend.repository.PermissionRepository;
import org.example.backend.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PermissionRepository permissionRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        UserRole role = user.getRole() == null ? UserRole.USER : user.getRole();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + role.name()));

        authorities.addAll(permissionRepository.findByRoleOrderByCodeAsc(UserRole.USER).stream()
                .map(permission -> new SimpleGrantedAuthority(permission.getCode()))
                .toList());

        if (role == UserRole.ADMIN) {
            authorities.addAll(permissionRepository.findByRoleOrderByCodeAsc(UserRole.ADMIN).stream()
                    .map(permission -> new SimpleGrantedAuthority(permission.getCode()))
                    .toList());
        }

        return new UserPrincipal(user, authorities);
    }
}
