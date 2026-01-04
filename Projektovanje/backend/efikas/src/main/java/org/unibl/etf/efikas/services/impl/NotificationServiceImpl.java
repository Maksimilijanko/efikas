package org.unibl.etf.efikas.services.impl;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.unibl.etf.efikas.exceptions.DuplicatePushTokenException;
import org.unibl.etf.efikas.models.dto.NotificationMessageDTO;
import org.unibl.etf.efikas.models.dto.UserDTO;
import org.unibl.etf.efikas.models.entities.AppUser;
import org.unibl.etf.efikas.models.entities.NotificationPushToken;
import org.unibl.etf.efikas.models.requests.PushNotificationTokenRequest;
import org.unibl.etf.efikas.models.requests.ToggleNotificationRequest;
import org.unibl.etf.efikas.repositories.AppUserRepository;
import org.unibl.etf.efikas.repositories.NotificationPushTokenRepository;
import org.unibl.etf.efikas.services.interfaces.NotificationService;
import org.unibl.etf.efikas.util.Constants;

import java.time.Instant;
import java.util.Map;

@Service
@AllArgsConstructor
public class NotificationServiceImpl implements NotificationService {
    private final NotificationPushTokenRepository notificationPushTokenRepository;
    private final AppUserRepository appUserRepository;
    private final RestClient expoRestClient;

    @Override
    public String addPushToken(PushNotificationTokenRequest tokenRequest) {
        Instant now = Instant.now();
        AppUser user = appUserRepository.findByEmail(tokenRequest.getEmail()).orElseThrow(() -> new EntityNotFoundException("User not found"));

        if(notificationPushTokenRepository.existsByPushToken(tokenRequest.getToken())) {
            throw new DuplicatePushTokenException();
        }

        NotificationPushToken notificationPushToken = new NotificationPushToken();
        notificationPushToken.setPushToken(tokenRequest.getToken());
        notificationPushToken.setPlatform(tokenRequest.getPlatform());
        notificationPushToken.setLastUsedAt(now);
        notificationPushToken.setUser(user);
        notificationPushToken.setEnabled(true);

        notificationPushTokenRepository.save(notificationPushToken);

        return "Token saved";
    }

    /**
     * Runs an asynchronous task in the background as a separate thread.
     * */
    @Override
    @Async("customAsyncExecutor")
    public void sendNotificationByToken(NotificationMessageDTO notificationMessageDTO) {
        System.out.println("\uD83D\uDD14 Sending notification - " +  notificationMessageDTO.getTitle());

        Map<String, Object> payload = Map.of(
                "to", notificationMessageDTO.getRecipientToken(),
                "title", notificationMessageDTO.getTitle(),
                "body", notificationMessageDTO.getBody(),
                "android", Map.of("channelId", "default")
        );

        this.expoRestClient.post()
                .uri(Constants.Expo.PUSH_NOTIFICATION_URI)
                .body(payload)
                // Specify content type
                .contentType(MediaType.APPLICATION_JSON)
                // Retrieve the response
                .retrieve()
                // Handle error status codes
                .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(), (req, res) -> {
                    throw new RuntimeException("API call failed with status: " + res.getStatusCode());
                })
                // Convert the response body to a Java object
                .body(String.class);
    }

    @Override
    public String toggleNotification(ToggleNotificationRequest toggleNotificationRequest) {
        NotificationPushToken notification = notificationPushTokenRepository.findByPushToken(toggleNotificationRequest.getPushToken()).orElseThrow(() -> new EntityNotFoundException("Push token not found"));
        notification.setEnabled(toggleNotificationRequest.isEnabled());
        notificationPushTokenRepository.save(notification);

        return "Notification toggled";
    }
}
