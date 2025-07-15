

package com.tinylink.service;

import com.tinylink.entity.ShortURL;
import com.tinylink.entity.User;
import com.tinylink.repository.URLRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class URLService {
    @Autowired
    private UserService userService;
    public java.util.Optional<ShortURL> getUrlByIdAndUser(Long id, User user) {
        return urlRepository.findByIdAndUser(id, user);
    }
    public boolean deleteByIdAndUser(Long id, User user) {
        ShortURL url = urlRepository.findById(id).orElse(null);
        if (url != null && url.getUser().getId().equals(user.getId())) {
            urlRepository.deleteById(id);
            return true;
        }
        return false;
    }
    public java.util.List<ShortURL> getUrlsByUser(User user) {
        return urlRepository.findAllByUser(user);
    }

    // Create with custom code if provided
    public ShortURL createShortURLWithCustomCode(String originalUrl, String customCode, User user) {
        // Always fetch the user from DB to avoid detached entity issues
        User persistedUser = userService.findByUsername(user.getUsername());
        // Check if custom code already exists
        if (urlRepository.findByShortCode(customCode) != null) {
            throw new IllegalArgumentException("Custom code already in use");
        }
        ShortURL shortUrl = new ShortURL();
        shortUrl.setOriginalUrl(originalUrl);
        shortUrl.setShortCode(customCode);
        shortUrl.setCreatedAt(LocalDateTime.now());
        shortUrl.setUser(persistedUser);
        return urlRepository.save(shortUrl);
    }

    @Autowired
    private URLRepository urlRepository;

    public ShortURL createShortURL(String originalUrl, User user) {
        // Always fetch the user from DB to avoid detached entity issues
        User persistedUser = userService.findByUsername(user.getUsername());
        String shortCode = UUID.randomUUID().toString().substring(0, 6);

        ShortURL shortUrl = new ShortURL();
        shortUrl.setOriginalUrl(originalUrl);
        shortUrl.setShortCode(shortCode);
        shortUrl.setCreatedAt(LocalDateTime.now());
        shortUrl.setUser(persistedUser);

        return urlRepository.save(shortUrl);
    }

    public ShortURL getByShortCode(String shortCode) {
        return urlRepository.findByShortCode(shortCode);
    }
}
