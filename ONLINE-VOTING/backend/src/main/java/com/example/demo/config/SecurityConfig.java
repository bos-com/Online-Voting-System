// File: src/main/java/com/example/demo/config/SecurityConfig.java

package com.example.demo.config; // Recommended package name

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
                Arrays.asList("http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"));

        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Disable CSRF protection for API development
                .csrf(AbstractHttpConfigurer::disable)

                // 2. Configure CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 3. Define authorization rules
                .authorizeHttpRequests(authorize -> authorize

                        // --- PUBLIC ACCESS (permitAll) ---

                        // 3a. VOTER ENDPOINTS
                        .requestMatchers(HttpMethod.POST, "/api/v1/voters/register").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/voters/login").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/voters").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/voters/**").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/v1/voters/**").permitAll()

                        // 3b. ELECTION ENDPOINTS
                        .requestMatchers(HttpMethod.GET, "/api/v1/elections").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/elections/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/elections").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/v1/elections/**").permitAll()
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/elections/**").permitAll()

                        // 3c. CANDIDATE ENDPOINTS
                        .requestMatchers(HttpMethod.GET, "/api/v1/candidates").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/candidates/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/candidates").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/v1/candidates/**").permitAll()
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/candidates/**").permitAll()

                        // 3d. VOTE ENDPOINTS
                        .requestMatchers(HttpMethod.GET, "/api/v1/votes").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/votes/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/votes").permitAll()
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/votes/**").permitAll()

                        // 3e. ADMIN ENDPOINTS (require authentication)
                        .requestMatchers(HttpMethod.POST, "/api/v1/admins/login").permitAll()
                        .requestMatchers("/api/v1/admins/**").authenticated()

                        // 3f. ALL OTHER ENDPOINTS
                        .anyRequest().permitAll())
                // Optional: Disable HTTP Basic if not needed
                .httpBasic(AbstractHttpConfigurer::disable);

        return http.build();
    }
}