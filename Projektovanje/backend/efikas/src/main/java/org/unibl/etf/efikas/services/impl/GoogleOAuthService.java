package org.unibl.etf.efikas.services.impl;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.unibl.etf.efikas.models.dto.UserDTO;
import org.unibl.etf.efikas.models.responses.AuthenticationResponse;
import org.unibl.etf.efikas.security.JwtUtil;
import org.unibl.etf.efikas.services.interfaces.OAuthService;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;

@Service
public class GoogleOAuthService implements OAuthService {
    private final JwtUtil jwtUtil;
    private final GoogleIdTokenVerifier verifier;

    public GoogleOAuthService(
            JwtUtil jwtUtil,
            @Value("${oauth2.client.registration.google.client-id}") String clientId
    ) {
        this.jwtUtil = jwtUtil;
        this.verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList(clientId))
                .build();
    }


    @Override
    public AuthenticationResponse authenticateOAuth(String idTokenString) throws GeneralSecurityException, IOException {
        GoogleIdToken.Payload payload = verify(idTokenString);

        if (payload == null || payload.getEmail() == null) {
            throw new RuntimeException("Invalid Google token");
        }

        System.out.println("PAYLOAD: " + payload.toString());

        String email = (String) payload.get("email");
        String firstName = (String) payload.get("given_name");
        String lastName = (String) payload.get("family_name");

        UserDTO user = UserDTO.builder()
                .name(firstName)
                .surname(lastName)
                .email(email)
                .build();
        String accessToken = jwtUtil.generateToken(email);

        return new AuthenticationResponse(user, accessToken);
    }

    private GoogleIdToken.Payload verify(String idTokenString) throws GeneralSecurityException, IOException {
        GoogleIdToken idToken = verifier.verify(idTokenString);
        if (idToken != null) {
            return idToken.getPayload();
        }

        return null;
    }
}
