package org.unibl.etf.efikas.controllers;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.unibl.etf.efikas.models.requests.PushNotificationTokenRequest;
import org.unibl.etf.efikas.services.interfaces.NotificationService;

@RestController
@RequestMapping("/api/v1/notifications")
@AllArgsConstructor
public class NotificationsController {

    private final NotificationService notificationService;

    @PostMapping("/push-token")
    public ResponseEntity<?> pushRegistrationToken(@RequestBody PushNotificationTokenRequest pushNotificationTokenRequest) {
        System.out.println("Push Token: " + pushNotificationTokenRequest);
        String resp = notificationService.addPushToken(pushNotificationTokenRequest);

        return ResponseEntity.ok(resp);
    }
}
