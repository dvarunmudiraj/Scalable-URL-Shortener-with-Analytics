package com.tinylink.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class ClickAnalytics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime clickTime;

    private String ip;
    private String userAgent;

    @ManyToOne
    private ShortURL shortUrl;

    // Getters and Setters
    public Long getId() { return id; }

    public LocalDateTime getClickTime() { return clickTime; }

    public void setClickTime(LocalDateTime clickTime) { this.clickTime = clickTime; }

    public String getIp() { return ip; }

    public void setIp(String ip) { this.ip = ip; }

    public String getUserAgent() { return userAgent; }

    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }

    public ShortURL getShortUrl() { return shortUrl; }

    public void setShortUrl(ShortURL shortUrl) { this.shortUrl = shortUrl; }
}
