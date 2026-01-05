package org.unibl.etf.efikas.controllers;

import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.unibl.etf.efikas.models.dto.ChangePasswordDTO;
import org.unibl.etf.efikas.models.dto.UserDTO;
import org.unibl.etf.efikas.models.dto.books.StoreDTO;
import org.unibl.etf.efikas.models.requests.CreateStoreRequest;
import org.unibl.etf.efikas.models.responses.AppUserResponse;
import org.unibl.etf.efikas.models.responses.AuthenticationResponse;
import org.unibl.etf.efikas.security.JwtUtil;
import org.unibl.etf.efikas.services.AppUserService;
import org.unibl.etf.efikas.services.StoreService;
import org.unibl.etf.efikas.services.interfaces.OAuthService;

import java.io.IOException;
import java.net.URI;
import java.security.GeneralSecurityException;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@AllArgsConstructor
public class AppUserController {

    private final AppUserService appUserService;
    private final StoreService storeService;
    private final OAuthService oAuthService;
    private final JwtUtil jwtUtil;


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> user) {
        return appUserService.register(user)
                .map(error -> ResponseEntity.badRequest().body(error))
                .orElseGet(() -> ResponseEntity.ok("User registered successfully."));
    }

    @PostMapping("/register/store")
    public ResponseEntity<?> registerStore(@RequestBody CreateStoreRequest createStoreRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        StoreDTO saved = storeService.createStore(createStoreRequest, authentication);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/store/{id}")
                .buildAndExpand(saved).toUri();

        return ResponseEntity.created(location).body(saved);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> userCredentials) {
        String email = userCredentials.get("email");
        String password = userCredentials.get("password");

        boolean isAuthenticated = appUserService.authenticate(email, password);

        if (!isAuthenticated) {
            return ResponseEntity.status(HttpServletResponse.SC_UNAUTHORIZED)
                    .body(Map.of("error", "Invalid credentials"));
        }

        // Generate token
        String token = jwtUtil.generateToken(email);

        // Prepare JWT to be returned to the user in JSON form
        return ResponseEntity.ok(Map.of(
                "email", email,
                "token", token
        ));
    }

    @PostMapping("/google/login")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> body) {
        String token = body.get("token");

        try{
            AuthenticationResponse authResponse = oAuthService.authenticateOAuth(token);

            return ResponseEntity.ok()
                    .body(Map.of("accessToken", authResponse.getAccessToken()));
        } catch (GeneralSecurityException | IOException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getAccountInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        AppUserResponse response = appUserService.getCurrentUserInfo(authentication);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateAccountInfo(@RequestBody UserDTO user) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        AppUserResponse response = appUserService.updateUserAccount(user, authentication);
        String email = response.getEmail();
        // Generate token (there might have been a change in email)
        String token = jwtUtil.generateToken(email);

        // Prepare JWT to be returned to the user in JSON form
        return ResponseEntity.ok(Map.of(
                "email", email,
                "token", token
        ));
    }

    @PutMapping("/me/password")
    public ResponseEntity<?> updatePassword(@RequestBody ChangePasswordDTO passwordChangeRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        appUserService.changeUserPassword(passwordChangeRequest, authentication);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/me")
    public ResponseEntity<?> deleteAccount() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        AppUserResponse response = appUserService.deleteUserAccount(authentication);

        return ResponseEntity.ok(response);
    }

}
