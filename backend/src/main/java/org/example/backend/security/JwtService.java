package org.example.backend.security;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.time.Instant;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;

@Service
public class JwtService {

    private static final String ROLE_CLAIM = "role";
    private static final String DEFAULT_ROLE = "ROLE_USER";
    private static final String HMAC_ALGORITHM = "HmacSHA256";
    private static final Base64.Encoder URL_ENCODER = Base64.getUrlEncoder().withoutPadding();
    private static final Base64.Decoder URL_DECODER = Base64.getUrlDecoder();

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${jwt.secret}")
    private String secret;

    @Getter
    @Value("${jwt.expiration-ms}")
    private long jwtExpirationMs;

    public String extractUsername(String token) {
        return extractClaim(token, claims -> (String) claims.get("sub"));
    }

    public String extractRole(String token) {
        return extractClaim(token, claims -> {
            Object role = claims.get(ROLE_CLAIM);
            return role == null || String.valueOf(role).isBlank() ? DEFAULT_ROLE : String.valueOf(role);
        });
    }

    public long extractExpirationEpochSeconds(String token) {
        return extractClaim(token, claims -> Long.parseLong(String.valueOf(claims.get("exp"))));
    }

    public <T> T extractClaim(String token, Function<Map<String, Object>, T> claimsResolver) {
        Map<String, Object> claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(UserDetails userDetails) {
        long issuedAt = Instant.now().getEpochSecond();
        long expiresAt = issuedAt + (jwtExpirationMs / 1000L);

        String role = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(authority -> authority != null && authority.startsWith("ROLE_"))
                .findFirst()
                .orElse(DEFAULT_ROLE);

        Map<String, Object> header = new LinkedHashMap<>();
        header.put("alg", "HS256");
        header.put("typ", "JWT");

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("sub", userDetails.getUsername());
        payload.put(ROLE_CLAIM, role);
        payload.put("iat", issuedAt);
        payload.put("exp", expiresAt);

        String encodedHeader = encodeJson(header);
        String encodedPayload = encodeJson(payload);
        String signature = sign(encodedHeader + "." + encodedPayload);
        return encodedHeader + "." + encodedPayload + "." + signature;
    }

    public boolean isTokenValid(String token, String username) {
        try {
            Map<String, Object> claims = extractAllClaims(token);
            String tokenUsername = (String) claims.get("sub");
            return Objects.equals(tokenUsername, username) && !isTokenExpired(claims) && isSignatureValid(token);
        } catch (RuntimeException ex) {
            return false;
        }
    }

    private boolean isTokenExpired(Map<String, Object> claims) {
        Object exp = claims.get("exp");
        if (exp == null) {
            return true;
        }
        long expiryEpochSeconds = Long.parseLong(String.valueOf(exp));
        return Instant.now().getEpochSecond() >= expiryEpochSeconds;
    }

    private boolean isSignatureValid(String token) {
        String[] parts = splitToken(token);
        String expectedSignature = sign(parts[0] + "." + parts[1]);
        return Objects.equals(expectedSignature, parts[2]);
    }

    private Map<String, Object> extractAllClaims(String token) {
        String[] parts = splitToken(token);
        String payloadJson = new String(URL_DECODER.decode(parts[1]), StandardCharsets.UTF_8);
        try {
            return objectMapper.readValue(payloadJson, new TypeReference<>() {});
        } catch (Exception ex) {
            throw new IllegalArgumentException("Invalid JWT payload", ex);
        }
    }

    private String encodeJson(Map<String, Object> value) {
        try {
            String json = objectMapper.writeValueAsString(value);
            return URL_ENCODER.encodeToString(json.getBytes(StandardCharsets.UTF_8));
        } catch (Exception ex) {
            throw new IllegalStateException("Failed to encode JWT", ex);
        }
    }

    private String sign(String data) {
        try {
            Mac mac = Mac.getInstance(HMAC_ALGORITHM);
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), HMAC_ALGORITHM));
            byte[] signatureBytes = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return URL_ENCODER.encodeToString(signatureBytes);
        } catch (GeneralSecurityException ex) {
            throw new IllegalStateException("Failed to sign JWT", ex);
        }
    }

    private String[] splitToken(String token) {
        String[] parts = token.split("\\.");
        if (parts.length != 3) {
            throw new IllegalArgumentException("Invalid JWT format");
        }
        return parts;
    }
}
