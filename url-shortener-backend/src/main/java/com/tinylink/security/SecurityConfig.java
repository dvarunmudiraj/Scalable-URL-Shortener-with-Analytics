package com.tinylink.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

 @Autowired
 private JWTFilter jwtFilter;

 @Bean
 public UserDetailsService userDetailsService() {
 return new CustomUserDetailsService();
 }

 @Bean
 public BCryptPasswordEncoder passwordEncoder() {
 return new BCryptPasswordEncoder();
 }

 @Bean
 public AuthenticationProvider authenticationProvider() {
 DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
 provider.setUserDetailsService(userDetailsService());
 provider.setPasswordEncoder(passwordEncoder());
 return provider;
 }

@Bean
public BCryptPasswordEncoder bCryptPasswordEncoder() {
    return new BCryptPasswordEncoder();
}


 @Bean
 public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
 return config.getAuthenticationManager();
 }

 @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        System.out.println("SecurityConfig: Configuring security filter chain");
        http
                .cors().and()
                .csrf().disable()
                .authorizeHttpRequests()
                // Allow public access to short URL redirects
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/url/{shortCode}").permitAll()
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/{shortCode}").permitAll()
                // Allow public access to auth endpoints
                .requestMatchers("/api/auth/**").permitAll()
                // Allow authenticated access to user URLs
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/url/my-urls").authenticated()
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/url/shorten").authenticated()
                .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/url/**").authenticated()
                .anyRequest().authenticated()
                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        System.out.println("SecurityConfig: Security filter chain built");
        return http.build();
    }

 @Bean
 public CorsConfigurationSource corsConfigurationSource() {
 CorsConfiguration configuration = new CorsConfiguration();
 configuration.setAllowedOrigins(List.of("http://localhost:8082", "http://localhost:3000", "http://localhost:5173"));
 configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
 configuration.setAllowedHeaders(List.of("*"));
 configuration.setAllowCredentials(true);

 UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
 source.registerCorsConfiguration("/**", configuration);
 return source;
 }
}
