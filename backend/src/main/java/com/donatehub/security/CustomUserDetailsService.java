package com.donatehub.security;

import com.donatehub.entity.Admin;
import com.donatehub.entity.User;
import com.donatehub.repository.AdminRepository;
import com.donatehub.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final AdminRepository adminRepository;

    public CustomUserDetailsService(UserRepository userRepository, AdminRepository adminRepository) {
        this.userRepository = userRepository;
        this.adminRepository = adminRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // First check in Admin table
        Optional<Admin> admin = adminRepository.findByEmail(email);
        if (admin.isPresent()) {
            return UserPrincipal.create(admin.get());
        }

        // Then check in User table
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            return UserPrincipal.create(user.get());
        }

        throw new UsernameNotFoundException("User not found with email: " + email);
    }
}
