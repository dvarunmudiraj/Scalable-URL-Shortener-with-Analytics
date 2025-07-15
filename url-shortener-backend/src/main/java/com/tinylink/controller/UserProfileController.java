package com.tinylink.controller;

import com.tinylink.entity.User;
import com.tinylink.service.UserService;
import com.tinylink.service.URLService;
import com.tinylink.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserProfileController {
    @Autowired private UserService userService;
    @Autowired private URLService urlService;
    @Autowired private AnalyticsService analyticsService;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfileStats(HttpServletRequest request) {
        String email = request.getUserPrincipal().getName();
        User user = userService.findByEmail(email);
        if (user == null) return ResponseEntity.status(403).body("Not authorized");
        int urlsCreated = urlService.getUrlsByUser(user).size();
        int totalClicks = urlService.getUrlsByUser(user).stream()
            .mapToInt(url -> (int) analyticsService.getClickCount(url.getShortCode()))
            .sum();
        Map<String, Object> stats = new HashMap<>();
        stats.put("urlsCreated", urlsCreated);
        stats.put("totalClicks", totalClicks);
        stats.put("memberSince", user.getCreatedAt() != null ? user.getCreatedAt().format(java.time.format.DateTimeFormatter.ISO_LOCAL_DATE) : "N/A");
        return ResponseEntity.ok(stats);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(HttpServletRequest request, @RequestBody Map<String, String> body) {
        String email = request.getUserPrincipal().getName();
        User user = userService.findByEmail(email);
        if (user == null) return ResponseEntity.status(403).body("Not authorized");
        String newUsername = body.get("username");
        if (newUsername != null && !newUsername.trim().isEmpty()) {
            user.setUsername(newUsername.trim());
            user.setCreatedAt(java.time.LocalDateTime.now());
            userService.save(user);
            return ResponseEntity.ok("Profile updated");
        }
        return ResponseEntity.badRequest().body("Invalid username");
    }
}
