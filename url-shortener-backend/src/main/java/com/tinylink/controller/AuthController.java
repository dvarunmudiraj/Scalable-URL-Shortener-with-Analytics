
package com.tinylink.controller;

import com.tinylink.dto.LoginRequest;
import com.tinylink.dto.SignupRequest;
import com.tinylink.entity.User;
import com.tinylink.repository.UserRepository;
import com.tinylink.security.JWTUtil;
import com.tinylink.service.UserService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;


@RestController
@RequestMapping("/api/auth")

public class AuthController {

 @Autowired
 private AuthenticationManager authenticationManager;

 @Autowired
 private UserService userService;

 @Autowired
  private BCryptPasswordEncoder passwordEncoder;

 @Autowired
 private UserRepository userRepository;

 @Autowired
 private JWTUtil jwtUtil;

// 🔐 LOGIN
@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest request) {
    System.out.println("Login attempt: email='" + request.getEmail() + "', password='" + request.getPassword() + "'");
    User user = userRepository.findByEmail(request.getEmail());
    System.out.println("User fetched from DB: " + user);
    if (user == null) {
        System.out.println("User not found for email: " + request.getEmail());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User not found");
    }
    if (!user.isApproved()) {
        System.out.println("User not approved: " + user.getEmail());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User not approved");
    }
    try {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        System.out.println("AuthenticationManager: authentication successful");
    } catch (Exception ex) {
        System.out.println("AuthenticationManager: authentication failed: " + ex.getMessage());
        ex.printStackTrace();
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid credentials");
    }

    String token = jwtUtil.generateToken(user.getEmail());

    Map<String, Object> response = new HashMap<>();
    response.put("user", Map.of(
        "id", user.getId(),
        "email", user.getEmail(),
        "username", user.getUsername(),
        "role", user.getRole(),
        "approved", user.isApproved()
    ));
    response.put("token", token);

    System.out.println("Login successful for: " + user.getEmail());
    return ResponseEntity.ok(response);
}
    // 📝 SIGNUP
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest request) {
        try {
            if (userRepository.findByEmail(request.getEmail()) != null) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already in use");
            }
            if (userRepository.findByUsername(request.getUsername()) != null) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already in use");
            }
            User user = new User();
            user.setUsername(request.getUsername());
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole("USER");
            user.setApproved(true); // allow instant login for development
            userRepository.save(user);
            return ResponseEntity.ok(Collections.singletonMap("message", "User registered successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Signup failed: " + e.getMessage());
        }
    }

    // 👀 Get pending users (for admin dashboard)
    @GetMapping("/pending_users")
    public ResponseEntity<?> getPendingUsers() {
        return ResponseEntity.ok(userRepository.findByApprovedFalse());
    }

    // ✅ Approve user (for admin)
    @PostMapping("/approve_user/{username}")
    public ResponseEntity<?> approveUser(@PathVariable String username) {
        User user = userRepository.findByUsername(username);
        if (user != null) {
            user.setApproved(true);
            userRepository.save(user);
            return ResponseEntity.ok("User approved.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }
    }

    // TEMP DEBUG: List all users (for debugging login issues)
    @GetMapping("/debug/users")
    public ResponseEntity<?> listAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }
}
