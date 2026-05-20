package com.example.viiamaps.security;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtUtilInitializer {

    @Value("${jwt.secret}")
    private String secret;

    @PostConstruct
    public void init() {
        JwtUtil.init(secret);
    }
}
