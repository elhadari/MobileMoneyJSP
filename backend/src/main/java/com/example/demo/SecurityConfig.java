package com.example.demo;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Vonoina ny CSRF mba hahafahan'ny Next.js manao POST/PUT/DELETE
            .csrf(csrf -> csrf.disable())
            
            // 2. Ampifandraisina amin'ilay CorsFilter any ambany ny Security
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // 3. Sokafana tanteraka ny lalana rehetra (Permit All)
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()
            );
            
        return http.build();
    }

    // Ity no "Source" tokana hitantana ny CORS rehetra
    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        
        config.setAllowCredentials(true);
        // Ny port an'ny Next.js (3000) sy ny IP-nao raha mampiasa Network ianao
        config.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://127.0.0.1:3000")); 
        
        config.setAllowedHeaders(Arrays.asList(
            "Origin", 
            "Content-Type", 
            "Accept", 
            "Authorization", 
            "X-Requested-With"
        ));
        
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}