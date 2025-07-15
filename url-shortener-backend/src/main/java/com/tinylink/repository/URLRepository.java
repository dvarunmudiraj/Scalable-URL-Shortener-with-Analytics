package com.tinylink.repository;

import com.tinylink.entity.ShortURL;
import org.springframework.data.jpa.repository.JpaRepository;

public interface URLRepository extends JpaRepository<ShortURL, Long> {
    ShortURL findByShortCode(String shortCode); 
    java.util.List<ShortURL> findAllByUser(com.tinylink.entity.User user);
    java.util.Optional<ShortURL> findByIdAndUser(Long id, com.tinylink.entity.User user);
}
