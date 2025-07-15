package com.tinylink.repository;

import com.tinylink.entity.ClickAnalytics;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AnalyticsRepository extends JpaRepository<ClickAnalytics, Long> {
    List<ClickAnalytics> findByShortUrlShortCode(String shortCode);
    long countByShortUrlShortCode(String shortCode);
}
