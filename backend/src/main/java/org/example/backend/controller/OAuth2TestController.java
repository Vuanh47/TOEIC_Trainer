package org.example.backend.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
public class OAuth2TestController {

    @GetMapping("/oauth2/me")
    public Map<String, Object> me(Authentication authentication) {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("authenticated", authentication != null && authentication.isAuthenticated());

        if (authentication == null) {
            return data;
        }

        data.put("name", authentication.getName());
        data.put("authorities", authentication.getAuthorities());

        if (authentication instanceof OAuth2AuthenticationToken oauth2Token) {
            OAuth2User principal = oauth2Token.getPrincipal();
            data.put("provider", oauth2Token.getAuthorizedClientRegistrationId());
            data.put("attributes", principal.getAttributes());
        }

        return data;
    }
}

