package com.tinylink.controller;

import com.tinylink.dto.ShortenRequest;
import com.tinylink.entity.ShortURL;
import com.tinylink.entity.User;
import com.tinylink.service.URLService;
import com.tinylink.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;
import com.tinylink.service.AnalyticsService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/url")
public class URLController {
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUrl(@PathVariable Long id, HttpServletRequest request) {
        String email = request.getUserPrincipal() != null ? request.getUserPrincipal().getName() : null;
        System.out.println("[DELETE URL] Requested by: " + email + ", URL id: " + id);
        if (email == null) {
            System.out.println("[DELETE URL] No user principal found (not authenticated)");
            return ResponseEntity.status(401).body("Not authenticated");
        }
        User user = userService.findByEmail(email);
        if (user == null) {
            System.out.println("[DELETE URL] User not found for email: " + email);
            return ResponseEntity.status(403).body("User not found");
        }
        boolean deleted = urlService.deleteByIdAndUser(id, user);
        if (deleted) {
            System.out.println("[DELETE URL] Deleted successfully");
            return ResponseEntity.ok().body("Deleted");
        } else {
            System.out.println("[DELETE URL] Not authorized or URL not found for user: " + email);
            return ResponseEntity.status(403).body("Not authorized or URL not found for this user");
        }
    }
    @GetMapping("/my-urls")
    public ResponseEntity<?> getMyUrls(HttpServletRequest request) {
        String email = request.getUserPrincipal().getName();
        User user = userService.findByEmail(email);
        java.util.List<ShortURL> urls = urlService.getUrlsByUser(user);
        java.util.List<java.util.Map<String, Object>> response = new java.util.ArrayList<>();
        String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
        for (ShortURL url : urls) {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", url.getId());
            map.put("originalUrl", url.getOriginalUrl());
            map.put("shortUrl", baseUrl + "/" + url.getShortCode());
            map.put("shortCode", url.getShortCode());
            map.put("clicks", analyticsService.getClickCount(url.getShortCode()));
            map.put("createdAt", url.getCreatedAt());
            response.add(map);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUrlById(@PathVariable Long id, HttpServletRequest request) {
        String email = request.getUserPrincipal().getName();
        User user = userService.findByEmail(email);
        java.util.Optional<ShortURL> urlOpt = urlService.getUrlByIdAndUser(id, user);
        if (urlOpt.isPresent()) {
            ShortURL url = urlOpt.get();
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", url.getId());
            map.put("originalUrl", url.getOriginalUrl());
            map.put("shortUrl", request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + "/" + url.getShortCode());
            map.put("shortCode", url.getShortCode());
            map.put("clicks", analyticsService.getClickCount(url.getShortCode()));
            map.put("createdAt", url.getCreatedAt());
            return ResponseEntity.ok(map);
        } else {
            return ResponseEntity.status(403).body("Not authorized or not found");
        }
    }

    @Autowired private URLService urlService;
    @Autowired private UserService userService;
    @Autowired private AnalyticsService analyticsService;

    @PostMapping("/shorten")
    public ResponseEntity<?> shortenUrl(@RequestBody ShortenRequest req, HttpServletRequest request) {
        String email = request.getUserPrincipal().getName();
        User user = userService.findByEmail(email);
        ShortURL shortURL;
        String customCode = req.getCustomCode();
        if (customCode != null && !customCode.isEmpty()) {
            shortURL = urlService.createShortURLWithCustomCode(req.getOriginalUrl(), customCode, user);
        } else {
            shortURL = urlService.createShortURL(req.getOriginalUrl(), user);
        }
        // Build full response object for frontend
        String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("id", shortURL.getId());
        response.put("originalUrl", shortURL.getOriginalUrl());
        response.put("shortUrl", baseUrl + "/" + shortURL.getShortCode());
        response.put("shortCode", shortURL.getShortCode());
        response.put("clicks", 0); // No clicks field, set to 0 for now
        response.put("createdAt", shortURL.getCreatedAt());
        return ResponseEntity.ok(response);
    }

}
