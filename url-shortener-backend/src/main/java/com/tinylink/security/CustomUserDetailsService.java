package com.tinylink.security;

import com.tinylink.entity.User;
import com.tinylink.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        System.out.println("CustomUserDetailsService: loadUserByUsername called with email: " + email);
        User user = userRepository.findByEmail(email);
        System.out.println("CustomUserDetailsService: userRepository.findByEmail returned: " + user);

        if (user == null) {
            System.out.println("CustomUserDetailsService: user is null for email: " + email);
            throw new UsernameNotFoundException("User not found");
        }
        if (!user.isApproved()) {
            System.out.println("CustomUserDetailsService: user not approved for email: " + email);
            throw new UsernameNotFoundException("User not approved");
        }

        System.out.println("CustomUserDetailsService: returning UserDetails for email: " + email);
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(), // use email as username
                user.getPassword(),
                new ArrayList<>()
        );
    }

}
