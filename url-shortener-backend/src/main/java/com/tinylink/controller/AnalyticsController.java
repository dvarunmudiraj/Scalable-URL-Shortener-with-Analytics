
package com.tinylink.controller;
import com.tinylink.entity.User;
import com.tinylink.service.UserService;

import com.tinylink.entity.ClickAnalytics;
import com.tinylink.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired private AnalyticsService analyticsService;
    @Autowired private UserService userService;

    @GetMapping("/{shortCode}")
    public Object getAnalytics(@PathVariable String shortCode, HttpServletRequest request) {
        String email = request.getUserPrincipal().getName();
        User user = userService.findByEmail(email);
        com.tinylink.entity.ShortURL url = analyticsService.getShortUrlByShortCode(shortCode);
        System.out.println("[DEBUG] JWT email: " + email);
        System.out.println("[DEBUG] DB user: " + (user != null ? user.getId() + ", " + user.getUsername() : "null"));
        System.out.println("[DEBUG] ShortURL.user: " + (url != null && url.getUser() != null ? url.getUser().getId() + ", " + url.getUser().getUsername() : "null"));
        if (user == null || url == null || url.getUser() == null || !url.getUser().getId().equals(user.getId())) {
            return org.springframework.http.ResponseEntity.status(403).body("Not authorized");
        }
        java.util.List<ClickAnalytics> clicks = analyticsService.getAnalytics(shortCode);
        java.util.Map<String, Object> result = new java.util.HashMap<>();
        // urlData
        java.util.Map<String, Object> urlData = new java.util.HashMap<>();
        urlData.put("originalUrl", url.getOriginalUrl());
        urlData.put("shortUrl", shortCode);
        urlData.put("totalClicks", clicks.size());
        urlData.put("createdAt", url.getCreatedAt());
        result.put("urlData", urlData);
        // clicksData (for chart)
        java.util.Map<String, Integer> dayMap = new java.util.HashMap<>();
        java.time.format.DateTimeFormatter fmt = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
        for (ClickAnalytics click : clicks) {
            String day = click.getClickTime().format(fmt);
            dayMap.put(day, dayMap.getOrDefault(day, 0) + 1);
        }
        java.util.List<java.util.Map<String, Object>> clicksData = new java.util.ArrayList<>();
        for (var entry : dayMap.entrySet()) {
            clicksData.add(java.util.Map.of("date", entry.getKey(), "clicks", entry.getValue()));
        }
        result.put("clicksData", clicksData);
        // locationData (mocked, as IP geolocation is not implemented)
        java.util.List<java.util.Map<String, Object>> locationData = new java.util.ArrayList<>();
        int indiaClicks = clicks.size();
        if (indiaClicks > 0) {
            locationData.add(java.util.Map.of("country", "India", "clicks", indiaClicks));
        }
        result.put("locationData", locationData);
        // deviceData (mocked)
        java.util.List<java.util.Map<String, Object>> deviceData = new java.util.ArrayList<>();
        deviceData.add(java.util.Map.of("name", "Desktop", "value", 60, "color", "#8B5CF6"));
        deviceData.add(java.util.Map.of("name", "Mobile", "value", 35, "color", "#3B82F6"));
        deviceData.add(java.util.Map.of("name", "Tablet", "value", 5, "color", "#06B6D4"));
        result.put("deviceData", deviceData);
        // recentActivity (mocked location/device)
        java.util.List<java.util.Map<String, Object>> recentActivity = new java.util.ArrayList<>();
        for (ClickAnalytics click : clicks.stream().sorted((a, b) -> b.getClickTime().compareTo(a.getClickTime())).limit(10).toList()) {
            recentActivity.add(java.util.Map.of(
                "location", "Unknown", // IP geolocation not implemented
                "device", click.getUserAgent() != null ? click.getUserAgent() : "Unknown",
                "time", click.getClickTime().toString()
            ));
        }
        result.put("recentActivity", recentActivity);
        // avgDailyClicks, topCountry, growthRate (mocked)
        result.put("avgDailyClicks", clicksData.isEmpty() ? 0 : clicks.size() / clicksData.size());
        result.put("topCountry", indiaClicks > 0 ? "India" : "N/A");
        result.put("growthRate", clicks.size() > 1 ? "10%" : "0%");
        return result;
    }
}
