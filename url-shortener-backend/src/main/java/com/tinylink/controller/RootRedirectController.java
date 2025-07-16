package com.tinylink.controller;

import com.tinylink.entity.ShortURL;
import com.tinylink.service.URLService;
import com.tinylink.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import jakarta.servlet.http.HttpServletRequest;

@RestController
public class RootRedirectController {
    @Autowired private URLService urlService;
    @Autowired private AnalyticsService analyticsService;

    // Root-level redirect for /{shortCode}
    @GetMapping(path = "/{shortCode}")
    public Object rootRedirect(@PathVariable String shortCode, HttpServletRequest request) {
        try {
            ShortURL url = urlService.getByShortCode(shortCode);
            if (url == null) {
                return org.springframework.http.ResponseEntity.status(404).body("Short URL not found");
            }
            String ip = request.getHeader("X-Forwarded-For");
            if (ip != null && !ip.isEmpty()) {
                // X-Forwarded-For may contain multiple IPs, use the first one
                int commaIdx = ip.indexOf(',');
                if (commaIdx > -1) {
                    ip = ip.substring(0, commaIdx).trim();
                } else {
                    ip = ip.trim();
                }
            } else {
                ip = request.getRemoteAddr();
            }
            String userAgent = request.getHeader("User-Agent");
            String referrer = request.getHeader("Referer");

            // Get location from IP using public API (ip-api.com)
            String location = null;
            try {
                java.net.URL geoUrl = new java.net.URL("http://ip-api.com/json/" + ip);
                java.io.BufferedReader in = new java.io.BufferedReader(new java.io.InputStreamReader(geoUrl.openStream()));
                StringBuilder sb = new StringBuilder();
                String inputLine;
                while ((inputLine = in.readLine()) != null) sb.append(inputLine);
                in.close();
                String json = sb.toString();
                com.fasterxml.jackson.databind.JsonNode node = new com.fasterxml.jackson.databind.ObjectMapper().readTree(json);
                String city = node.has("city") ? node.get("city").asText() : "";
                String country = node.has("country") ? node.get("country").asText() : "";
                location = city + (city.isEmpty() ? "" : ", ") + country;
            } catch (Exception geoEx) {
                location = null;
            }

            analyticsService.logClick(shortCode, ip, userAgent, referrer, location);
            return new RedirectView(url.getOriginalUrl());
        } catch (Exception e) {
            e.printStackTrace();
            return org.springframework.http.ResponseEntity.status(500).body("Internal Server Error: " + e.getMessage());
        }
    }
}
