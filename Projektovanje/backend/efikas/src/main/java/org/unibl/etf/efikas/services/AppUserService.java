package org.unibl.etf.efikas.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.unibl.etf.efikas.models.dto.ChangePasswordDTO;
import org.unibl.etf.efikas.models.dto.UserDTO;
import org.unibl.etf.efikas.models.dto.books.TaxpayerDTO;
import org.unibl.etf.efikas.models.entities.AppUser;
import org.unibl.etf.efikas.repositories.AppUserRepository;
import org.unibl.etf.efikas.models.responses.AppUserResponse;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AppUserService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;

    public AppUserResponse getUserById(int userId) {
        AppUser appUser = appUserRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found"));

        return modelMapper.map(appUser, AppUserResponse.class);
    }

    public AppUser getUserByEmail(String email) {
        return appUserRepository.findByEmail(email).orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    public Optional<String> register(Map<String, String> user) {
        String email = user.get("email");
        String password = user.get("password");
        String name = user.get("name");
        String surname = user.get("surname");
        String jib = user.get("jib");
        String address = user.get("address");

        if (appUserRepository.existsByEmail(email)) {
            return Optional.of("Email already exists.");
        }

        AppUser newUser = new AppUser();
        newUser.setEmail(email);
        newUser.setName(name);
        newUser.setSurname(surname);
        newUser.setJib(jib);
        newUser.setAddress(address);
        // hashing the password
        newUser.setPasswordHash(passwordEncoder.encode(password));

        appUserRepository.save(newUser);
        return Optional.empty(); // no error
    }

    public boolean authenticate(String email, String password) {
        return appUserRepository.findByEmail(email).map(user -> passwordEncoder.matches(password, user.getPasswordHash()))
                .orElse(false);
    }

    public String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("User is not logged in.");
        }

        return authentication.getName();
    }

    public AppUserResponse getCurrentUserInfo(Authentication authentication) {
        String email = authentication.getName();
        AppUser user = appUserRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found!"));

        return modelMapper.map(user, AppUserResponse.class);
    }

    public AppUserResponse updateUserAccount(UserDTO userDto, Authentication authentication) {
        String email = authentication.getName();

        AppUser user = appUserRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found!"));

        user.setName(userDto.getName());
        user.setSurname(userDto.getSurname());
        user.setJib(userDto.getJib());
        user.setEmail(userDto.getEmail());
        user.setAddress(userDto.getAddress());

        return modelMapper.map(appUserRepository.save(user), AppUserResponse.class);
    }

    public void changeUserPassword(ChangePasswordDTO changePasswordDTO, Authentication authentication) {
        String email = authentication.getName();
        AppUser user = appUserRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found!"));

        if(!passwordEncoder.matches(changePasswordDTO.getOldPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Incorrect old password!");
        };

        if(passwordEncoder.matches(changePasswordDTO.getNewPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "New password cannot be the same as old password!");
        }

        if(!changePasswordDTO.getNewPassword().equals(changePasswordDTO.getConfirmPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Passwords do not match!");
        }

        user.setPasswordHash(passwordEncoder.encode(changePasswordDTO.getNewPassword()));
        appUserRepository.save(user);
    }

    public AppUserResponse deleteUserAccount(Authentication authentication) {
        String email = authentication.getName();
        AppUser user = appUserRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found!"));

        appUserRepository.delete(user);
        return modelMapper.map(user, AppUserResponse.class);
    }

}
