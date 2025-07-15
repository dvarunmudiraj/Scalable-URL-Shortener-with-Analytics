package com.tinylink.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.*;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class RedisService {

    @Autowired private RedisTemplate<String, String> redisTemplate;

    public void cacheShortUrl(String shortCode, String originalUrl) {
        redisTemplate.opsForValue().set(shortCode, originalUrl, 1, TimeUnit.DAYS);
    }

    public String getOriginalUrlFromCache(String shortCode) {
        return redisTemplate.opsForValue().get(shortCode);
    }

    public boolean isRateLimitExceeded(String username) {
        String key = "rate:" + username;
        Long count = redisTemplate.opsForValue().increment(key);
        if (count != null && count == 1) {
            redisTemplate.expire(key, 1, TimeUnit.DAYS);
        }
        return count != null && count > 100;
    }
}
