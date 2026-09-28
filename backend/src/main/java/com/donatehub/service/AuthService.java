package com.donatehub.service;

import com.donatehub.dto.auth.AuthResponse;
import com.donatehub.dto.auth.LoginRequest;
import com.donatehub.dto.auth.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
