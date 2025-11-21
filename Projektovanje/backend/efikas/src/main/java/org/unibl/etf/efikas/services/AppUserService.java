package org.unibl.etf.efikas.services;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.unibl.etf.efikas.models.entities.AppUser;
import org.unibl.etf.efikas.repositories.AppUserRepository;

import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AppUserService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public Optional<String> register(Map<String, String> user) {
        String email = user.get("email");
        String password = user.get("password");
        String name = user.get("name");
        String surname = user.get("surname");
        String jib = user.get("jib");

        if (appUserRepository.existsByEmail(email)) {
            return Optional.of("Email already exists.");
        }

        AppUser newUser = new AppUser();
        newUser.setEmail(email);
        newUser.setName(name);
        newUser.setSurname(surname);
        newUser.setJib(jib);
        // hashing the password
        newUser.setPasswordHash(passwordEncoder.encode(password));

        appUserRepository.save(newUser);
        return Optional.empty(); // no error
    }

    public boolean authenticate(String email, String password) {
        return appUserRepository.findByEmail(email).map(user -> passwordEncoder.matches(password, user.getPasswordHash()))
                .orElse(false);
    }
}
