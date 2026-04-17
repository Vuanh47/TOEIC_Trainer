package org.example.backend.security;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService customUserDetailsService;
    private final TokenBlacklistService tokenBlacklistService;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        boolean isAuthPathButNotLogout = path.startsWith("/auth/") && !path.equals("/auth/logout");
        return isAuthPathButNotLogout
                || path.equals("/auth")
                || path.startsWith("/oauth2/")
                || path.startsWith("/login/")
                || path.equals("/login");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        String jwt = extractToken(authHeader);
        if (jwt == null) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            if (tokenBlacklistService.isTokenRevoked(jwt)) {
                SecurityContextHolder.clearContext();
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token has been logged out");
                return;
            }

            String username = jwtService.extractUsername(jwt);

            if (username != null && jwtService.isTokenValid(jwt, username)) {
                UserPrincipal userDetails = (UserPrincipal) customUserDetailsService.loadUserByUsername(username);
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                filterChain.doFilter(request, response);
                return;
            }

            SecurityContextHolder.clearContext();
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token");
            return;
        } catch (RuntimeException ex) {
            SecurityContextHolder.clearContext();
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token");
            return;
        }

    }

    private String extractToken(String authHeader) {
        if (authHeader == null) {
            return null;
        }

        String value = authHeader.trim();
        if (value.isEmpty()) {
            return null;
        }

        if (value.regionMatches(true, 0, "Bearer ", 0, 7)) {
            String token = value.substring(7).trim();
            return token.isEmpty() ? null : token;
        }

        return value;
    }
}
