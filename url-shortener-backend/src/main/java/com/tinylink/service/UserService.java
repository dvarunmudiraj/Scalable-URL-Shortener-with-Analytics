package com.tinylink.service;

import com.tinylink.dto.SignupRequest;
import com.tinylink.entity.User;

public interface UserService {
 User registerUser(SignupRequest request);
 User findByUsername(String username);
 User findByEmail(String email);
 User save(User user);
}
