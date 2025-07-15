package com.tinylink.service.impl;

import com.tinylink.dto.SignupRequest;
import com.tinylink.entity.User;
import com.tinylink.repository.UserRepository;
import com.tinylink.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

 @Autowired
 private UserRepository userRepository;

 @Autowired
 private PasswordEncoder passwordEncoder;

 @Override
 public User registerUser(SignupRequest request) {
 User user = new User();
 user.setEmail(request.getEmail());
 user.setUsername(request.getUsername());
 user.setPassword(passwordEncoder.encode(request.getPassword()));
 user.setRole("USER");
 user.setApproved(true);
 return userRepository.save(user);
}

 @Override
 public User findByUsername(String username) {
     return userRepository.findByUsername(username);
 }
 @Override
 public User findByEmail(String email) {
     return userRepository.findByEmail(email);
 }
 @Override
 public User save(User user) {
     return userRepository.save(user);
 }
}
