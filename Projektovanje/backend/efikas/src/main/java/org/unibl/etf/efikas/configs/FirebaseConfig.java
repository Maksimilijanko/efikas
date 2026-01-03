package org.unibl.etf.efikas.configs;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging;
import lombok.extern.log4j.Log4j2;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;

@Configuration
@Slf4j
// TODO: delete, not useful anymore with Expo's API
public class FirebaseConfig {

    @Bean
    GoogleCredentials googleCredentials() throws IOException {
        return GoogleCredentials.fromStream(
                new ClassPathResource("efikas-firebase-service-account.json").getInputStream()
        );
    }

    @Bean
    public FirebaseMessaging firebaseMessaging(GoogleCredentials googleCredentials) throws IOException {
        FirebaseApp app = firebaseApp(googleCredentials);

        return FirebaseMessaging.getInstance(app);
    }

    @Bean
    FirebaseApp firebaseApp(GoogleCredentials googleCredentials) throws IOException {
        FirebaseOptions firebaseOptions = FirebaseOptions.builder()
                .setCredentials(googleCredentials)
                .build();

        if (FirebaseApp.getApps().isEmpty()) {
            log.info("Firebase initialized successfully");
            return FirebaseApp.initializeApp(firebaseOptions, "eFikas");
        }

        log.warn("Firebase failed to initialize");
        return null;
    }
}
