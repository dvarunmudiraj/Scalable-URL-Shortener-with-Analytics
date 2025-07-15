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
            String ip = request.getRemoteAddr();
            String userAgent = request.getHeader("User-Agent");
            analyticsService.logClick(shortCode, ip, userAgent);
            return new RedirectView(url.getOriginalUrl());
        } catch (Exception e) {
            e.printStackTrace();
            return org.springframework.http.ResponseEntity.status(500).body("Internal Server Error: " + e.getMessage());
        }
    }
}
