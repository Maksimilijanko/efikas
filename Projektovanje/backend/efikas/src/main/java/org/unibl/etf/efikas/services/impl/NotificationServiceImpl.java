package org.unibl.etf.efikas.services.impl;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.unibl.etf.efikas.exceptions.DuplicatePushTokenException;
import org.unibl.etf.efikas.models.dto.NotificationMessageDTO;
import org.unibl.etf.efikas.models.entities.AppUser;
import org.unibl.etf.efikas.models.entities.NotificationPushToken;
import org.unibl.etf.efikas.models.requests.PushNotificationTokenRequest;
import org.unibl.etf.efikas.repositories.AppUserRepository;
import org.unibl.etf.efikas.repositories.NotificationPushTokenRepository;
import org.unibl.etf.efikas.services.interfaces.NotificationService;

import java.time.Instant;
import java.util.Map;

@Service
@AllArgsConstructor
public class NotificationServiceImpl implements NotificationService {
    private final NotificationPushTokenRepository notificationPushTokenRepository;
    private final AppUserRepository appUserRepository;
    private final ModelMapper modelMapper;

    private final RestClient restClient = RestClient.builder()
            .baseUrl("https://exp.host")
            .build();

    @Override
    public String addPushToken(PushNotificationTokenRequest tokenRequest) {
        Instant now = Instant.now();
        AppUser user = appUserRepository.findById(tokenRequest.getUserId()).orElseThrow(EntityNotFoundException::new);

        if(notificationPushTokenRepository.existsByPushToken(tokenRequest.getToken())) {
            throw new DuplicatePushTokenException();
        }

        NotificationPushToken notificationPushToken = new NotificationPushToken();
        notificationPushToken.setPushToken(tokenRequest.getToken());
        notificationPushToken.setPlatform(tokenRequest.getPlatform());
        notificationPushToken.setLastUsedAt(now);
        notificationPushToken.setUser(user);

        notificationPushTokenRepository.save(notificationPushToken);

        return "Token saved";
    }

    @Override
    public String sendNotificationByToken(NotificationMessageDTO notificationMessageDTO) {
        System.out.println("\uD83D\uDD14 Sending notification - " +  notificationMessageDTO.getTitle());

        Map<String, Object> payload = Map.of(
                "to", notificationMessageDTO.getRecipientToken(),
                "title", notificationMessageDTO.getTitle(),
                "body", notificationMessageDTO.getBody(),
                "android", Map.of("channelId", "default")
        );

        return this.restClient.post()
                .uri("/--/api/v2/push/send")
                .body(payload)
                // Specify content type
                .contentType(MediaType.APPLICATION_JSON)
                // Retrieve the response
                .retrieve()
                // Handle error status codes (optional, but good practice)
                .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(), (req, res) -> {
                    throw new RuntimeException("API call failed with status: " + res.getStatusCode());
                })
                // Convert the response body to a Java object (e.g., Post.class)
                .body(String.class);
    }
}
