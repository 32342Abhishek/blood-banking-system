package com.example.demo.security;

import com.example.demo.service.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            // Log the request path to help with debugging
            String requestPath = request.getRequestURI();
            String method = request.getMethod();
            logger.info("Processing request: {} {}", method, requestPath);
            
            // Check request details
            logger.info("Request from: {}", request.getRemoteAddr());
            logger.info("Content-Type: {}", request.getContentType());
            
            // For OPTIONS requests (CORS preflight), skip token validation
            if (method.equals("OPTIONS")) {
                logger.info("Handling OPTIONS preflight request for path: {}", requestPath);
                
                // Add CORS headers for preflight response
                response.setHeader("Access-Control-Allow-Origin", "*");
                response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
                response.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type, X-Requested-With");
                response.setHeader("Access-Control-Max-Age", "3600");
                
                filterChain.doFilter(request, response);
                return;
            }
            
            // Check if the request path is public
            if (isPublicEndpoint(requestPath)) {
                logger.info("Public endpoint accessed: {}", requestPath);
                filterChain.doFilter(request, response);
                return;
            }
            
            // Extract and validate JWT token
            String jwt = parseJwt(request);
            if (jwt != null) {
                logger.info("JWT token found in request, length: {}", jwt.length());
                
                if (jwtUtils.validateJwtToken(jwt)) {
                    String username = jwtUtils.getUsernameFromJwtToken(jwt);
                    String role = jwtUtils.getRoleFromJwtToken(jwt);
                    Long userId = jwtUtils.getUserIdFromJwtToken(jwt);
                    
                    logger.info("JWT token validated for user: {}, role: {}, userId: {}", username, role, userId);

                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    logger.info("Authentication set in SecurityContext for user: {}", username);
                } else {
                    logger.warn("Invalid JWT token for request: {} {}", method, requestPath);
                }
            } else {
                logger.warn("No JWT token found for protected request: {} {}", method, requestPath);
            }
        } catch (Exception e) {
            logger.error("Authentication error for {} {}: {}", request.getMethod(), request.getRequestURI(), e.getMessage(), e);
        }

        filterChain.doFilter(request, response);
    }
    
    /**
     * Check if the given endpoint is public (no authentication needed)
     */
    private boolean isPublicEndpoint(String path) {
        return path.startsWith("/api/auth/") || 
               path.startsWith("/api/public/") ||
               path.startsWith("/api/health/") ||
               path.startsWith("/api/test/") ||
               path.startsWith("/api/blood-inventory/stock") ||
               path.equals("/api/blood-inventory");
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        
        if (headerAuth == null) {
            logger.debug("Authorization header is null");
            return null;
        }
        
        // Log auth header safely
        logger.info("Authorization header present: {}", 
                headerAuth.length() > 15 ? headerAuth.substring(0, 15) + "..." : headerAuth);
                
        // Check for different header formats
        if (headerAuth.startsWith("Bearer ")) {
            String token = headerAuth.substring(7);
            
            if (token.isEmpty()) {
                logger.warn("Empty token after Bearer prefix");
                return null;
            }
            
            // Validate token format
            logger.info("Found Bearer token of length {}", token.length());
            return token;
        } else if (headerAuth.startsWith("bearer ")) {
            // Handle lowercase bearer
            String token = headerAuth.substring(7);
            logger.info("Found lowercase bearer token of length {}", token.length());
            return token;
        } else if (!headerAuth.contains(" ")) {
            // Could be just the raw token
            logger.info("Found possible raw token: {}", 
                    headerAuth.length() > 15 ? headerAuth.substring(0, 15) + "..." : headerAuth);
            return headerAuth;
        } else {
            logger.warn("Authorization header in unexpected format: {}", 
                    headerAuth.length() > 15 ? headerAuth.substring(0, 15) + "..." : headerAuth);
            return null;
        }
    }
}