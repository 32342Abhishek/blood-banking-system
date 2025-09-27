package com.example.demo.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(authz -> authz
                // Public endpoints - no authentication required
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/health/**").permitAll()
                .requestMatchers("/api/test/**").permitAll()
                
                // OPTIONS requests should be permitted for CORS preflight
                .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                
                // Admin-only endpoints
                .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")
                .requestMatchers("/api/blood-donations/pending").hasAuthority("ROLE_ADMIN")
                .requestMatchers("/api/blood-requests/pending").hasAuthority("ROLE_ADMIN") 
                .requestMatchers("/api/blood-donations/*/approve").hasAuthority("ROLE_ADMIN")
                .requestMatchers("/api/blood-donations/*/reject").hasAuthority("ROLE_ADMIN")
                .requestMatchers("/api/blood-requests/*/approve").hasAuthority("ROLE_ADMIN")
                .requestMatchers("/api/blood-requests/*/reject").hasAuthority("ROLE_ADMIN")
                .requestMatchers("/api/blood-inventory/update").hasAuthority("ROLE_ADMIN")
                
                // User or admin can access
                .requestMatchers("/api/donation-appointments").hasAnyAuthority("ROLE_ADMIN", "ROLE_USER")
                .requestMatchers("/api/blood-inventory").permitAll()
                .requestMatchers("/api/blood-inventory/stock").permitAll()
                
                // All other endpoints require authentication
                .anyRequest().authenticated()
            )
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(jwtAuthenticationEntryPoint)
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );
        
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // For development, allow all origins
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        
        // Allow all necessary HTTP methods
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"));
        
        // Allow all headers requested by the client
        configuration.setAllowedHeaders(Arrays.asList(
            "Authorization", 
            "Content-Type", 
            "X-Requested-With", 
            "Accept", 
            "Origin", 
            "Access-Control-Request-Method", 
            "Access-Control-Request-Headers",
            "Cache-Control"
        ));
        
        // Expose headers to the client
        configuration.setExposedHeaders(Arrays.asList(
            "Authorization", 
            "Content-Type", 
            "Access-Control-Allow-Origin",
            "Access-Control-Allow-Credentials",
            "Cache-Control"
        ));
        
        // Important: maxAge determines how long the preflight response can be cached
        configuration.setMaxAge(3600L);
        
        // Allow cookies and authentication
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}