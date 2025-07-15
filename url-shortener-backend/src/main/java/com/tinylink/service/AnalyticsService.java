// Removed duplicate misplaced method
package com.tinylink.service;

import com.tinylink.entity.ClickAnalytics;
import com.tinylink.entity.ShortURL;
import com.tinylink.repository.AnalyticsRepository;
import com.tinylink.repository.URLRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AnalyticsService {

    public ShortURL getShortUrlByShortCode(String shortCode) {
        return urlRepository.findByShortCode(shortCode);
    }

    @Autowired
    private AnalyticsRepository analyticsRepository;

    @Autowired
    private URLRepository urlRepository;

    // ✅ This is the method used in URLController
    public void logClick(String shortCode, String ip, String userAgent) {
        ShortURL shortURL = urlRepository.findByShortCode(shortCode);
        if (shortURL == null) return;

        ClickAnalytics click = new ClickAnalytics();
        click.setShortUrl(shortURL);
        click.setClickTime(LocalDateTime.now());
        click.setIp(ip);
        click.setUserAgent(userAgent);

        analyticsRepository.save(click);
    }

    public List<ClickAnalytics> getAnalytics(String shortCode) {
        return analyticsRepository.findByShortUrlShortCode(shortCode);
    }

    public long getClickCount(String shortCode) {
        return analyticsRepository.countByShortUrlShortCode(shortCode);
    }
}
