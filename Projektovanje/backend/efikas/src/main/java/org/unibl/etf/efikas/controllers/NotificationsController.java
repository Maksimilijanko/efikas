package org.unibl.etf.efikas.controllers;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.unibl.etf.efikas.models.requests.PushNotificationTokenRequest;
import org.unibl.etf.efikas.models.requests.ToggleNotificationRequest;
import org.unibl.etf.efikas.services.interfaces.NotificationService;

@RestController
@RequestMapping("/api/v1/notifications")
@AllArgsConstructor
public class NotificationsController {
    private final NotificationService notificationService;

    @PostMapping("/push-token")
    public ResponseEntity<?> pushRegistrationToken(@RequestBody PushNotificationTokenRequest pushNotificationTokenRequest) {
        System.out.println("Push token request: " + pushNotificationTokenRequest);
        String resp = notificationService.addPushToken(pushNotificationTokenRequest);

        return ResponseEntity.ok(resp);
    }

    @PutMapping("/toggle")
    public ResponseEntity<?> updateNotifications(@RequestBody ToggleNotificationRequest toggleNotificationRequest)
    {
        System.out.println("Toggle notification request: " + toggleNotificationRequest);
        String resp = notificationService.toggleNotification(toggleNotificationRequest);

        return ResponseEntity.ok(resp);
    }
}
