package org.example.backend.security;

import lombok.RequiredArgsConstructor;
import org.example.backend.entity.User;
import org.example.backend.entity.UserProfile;
import org.example.backend.enums.AuthProvider;
import org.example.backend.enums.UserRole;
import org.example.backend.enums.UserStatus;
import org.example.backend.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        Map<String, Object> attributes = oauth2User.getAttributes();

        String email = extractEmail(registrationId, attributes);
        if (email == null || email.isBlank()) {
            throw new OAuth2AuthenticationException(new OAuth2Error("invalid_user_info"), "Email not found from OAuth2 provider");
        }
        email = email.trim().toLowerCase();

        User user = userRepository.findByEmail(email).orElseGet(User::new);
        if (user.getId() == null) {
            user.setEmail(email);
            user.setRole(UserRole.USER);
            user.setStatus(UserStatus.ACTIVE);
            user.setPremium(false);

            UserProfile profile = new UserProfile();
            profile.setUser(user);
            user.setProfile(profile);
        }

        user.setAuthProvider(resolveProvider(registrationId));
        user.setProviderUserId(extractProviderUserId(registrationId, attributes));

        String fullName = extractFullName(registrationId, attributes);
        if (fullName != null && !fullName.isBlank()) {
            user.setFullName(fullName.trim());
        }

        String avatarUrl = extractAvatarUrl(registrationId, attributes);
        if (avatarUrl != null && !avatarUrl.isBlank()) {
            user.setAvatarUrl(avatarUrl.trim());
        }

        User savedUser = userRepository.save(user);

        Set<GrantedAuthority> authorities = new HashSet<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + savedUser.getRole().name()));

        return new DefaultOAuth2User(authorities, attributes, resolveNameAttributeKey(registrationId));
    }

    private AuthProvider resolveProvider(String registrationId) {
        if ("google".equalsIgnoreCase(registrationId)) {
            return AuthProvider.GOOGLE;
        }
        if ("github".equalsIgnoreCase(registrationId)) {
            return AuthProvider.GITHUB;
        }
        return AuthProvider.EMAIL;
    }

    private String extractEmail(String registrationId, Map<String, Object> attributes) {
        String email = getAsString(attributes.get("email"));
        if (email != null && !email.isBlank()) {
            return email;
        }

        if ("github".equalsIgnoreCase(registrationId)) {
            String login = getAsString(attributes.get("login"));
            if (login != null && !login.isBlank()) {
                return login + "@users.noreply.github.com";
            }
        }

        return null;
    }

    private String extractProviderUserId(String registrationId, Map<String, Object> attributes) {
        if ("google".equalsIgnoreCase(registrationId)) {
            return getAsString(attributes.get("sub"));
        }
        if ("github".equalsIgnoreCase(registrationId)) {
            return getAsString(attributes.get("id"));
        }
        return null;
    }

    private String extractFullName(String registrationId, Map<String, Object> attributes) {
        if ("github".equalsIgnoreCase(registrationId)) {
            String name = getAsString(attributes.get("name"));
            if (name == null || name.isBlank()) {
                return getAsString(attributes.get("login"));
            }
            return name;
        }
        return getAsString(attributes.get("name"));
    }

    private String extractAvatarUrl(String registrationId, Map<String, Object> attributes) {
        if ("google".equalsIgnoreCase(registrationId)) {
            return getAsString(attributes.get("picture"));
        }
        if ("github".equalsIgnoreCase(registrationId)) {
            return getAsString(attributes.get("avatar_url"));
        }
        return null;
    }

    private String resolveNameAttributeKey(String registrationId) {
        if ("github".equalsIgnoreCase(registrationId)) {
            return "id";
        }
        return "sub";
    }

    private String getAsString(Object value) {
        return value == null ? null : String.valueOf(value);
    }
}

