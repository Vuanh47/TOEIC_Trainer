package org.example.backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class TokenBlacklistService {

    private final JwtService jwtService;
    private final Map<String, Long> revokedTokens = new ConcurrentHashMap<>();

    public void revokeToken(String token) {
        long expiresAt = jwtService.extractExpirationEpochSeconds(token);
        if (expiresAt <= Instant.now().getEpochSecond()) {
            return;
        }

        revokedTokens.put(token, expiresAt);
        cleanupExpiredTokens();
    }

    public boolean isTokenRevoked(String token) {
        cleanupExpiredTokens();
        Long expiresAt = revokedTokens.get(token);
        if (expiresAt == null) {
            return false;
        }

        if (expiresAt <= Instant.now().getEpochSecond()) {
            revokedTokens.remove(token);
            return false;
        }
        return true;
    }

    private void cleanupExpiredTokens() {
        long now = Instant.now().getEpochSecond();
        Iterator<Map.Entry<String, Long>> iterator = revokedTokens.entrySet().iterator();
        while (iterator.hasNext()) {
            Map.Entry<String, Long> entry = iterator.next();
            if (entry.getValue() <= now) {
                iterator.remove();
            }
        }
    }
}

