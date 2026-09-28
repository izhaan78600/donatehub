package com.donatehub.service.impl;

import com.donatehub.dto.auth.AuthResponse;
import com.donatehub.dto.auth.LoginRequest;
import com.donatehub.dto.auth.RegisterRequest;
import com.donatehub.entity.Donor;
import com.donatehub.entity.User;
import com.donatehub.exception.BadRequestException;
import com.donatehub.repository.AdminRepository;
import com.donatehub.repository.DonorRepository;
import com.donatehub.repository.UserRepository;
import com.donatehub.security.JwtTokenProvider;
import com.donatehub.security.UserPrincipal;
import com.donatehub.service.AuditLogService;
import com.donatehub.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final AdminRepository adminRepository;
    private final DonorRepository donorRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final AuditLogService auditLogService;

    public AuthServiceImpl(UserRepository userRepository,
                           AdminRepository adminRepository,
                           DonorRepository donorRepository,
                           PasswordEncoder passwordEncoder,
                           AuthenticationManager authenticationManager,
                           JwtTokenProvider tokenProvider,
                           AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.adminRepository = adminRepository;
        this.donorRepository = donorRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.auditLogService = auditLogService;
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Password and confirm password do not match");
        }

        if (userRepository.existsByEmail(request.getEmail()) || adminRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        User user = new User(
                request.getFullName(),
                request.getEmail().toLowerCase().trim(),
                request.getPhone(),
                passwordEncoder.encode(request.getPassword()),
                request.getAddress(),
                "ROLE_USER"
        );
        User savedUser = userRepository.save(user);

        // Automatically create linked Donor profile for the user
        Donor donor = new Donor(
                savedUser,
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getPhone(),
                savedUser.getAddress()
        );
        donorRepository.save(donor);

        auditLogService.log(savedUser.getId(), "REGISTER", "USER", savedUser.getId(),
                "User registered with email: " + savedUser.getEmail());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().toLowerCase().trim(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        return new AuthResponse(token, savedUser.getId(), savedUser.getFullName(), savedUser.getEmail(), savedUser.getRole());
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().toLowerCase().trim(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

        auditLogService.log(principal.getId(), "LOGIN", principal.getRole().contains("ADMIN") ? "ADMIN" : "USER",
                principal.getId(), "User logged in: " + principal.getUsername());

        return new AuthResponse(token, principal.getId(), principal.getName(), principal.getUsername(), principal.getRole());
    }
}
