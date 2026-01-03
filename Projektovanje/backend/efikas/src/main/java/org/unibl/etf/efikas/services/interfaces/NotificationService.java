package org.unibl.etf.efikas.services.interfaces;

import org.unibl.etf.efikas.models.dto.NotificationMessageDTO;
import org.unibl.etf.efikas.models.requests.PushNotificationTokenRequest;

import java.util.concurrent.CompletableFuture;

public interface NotificationService {
    String addPushToken(PushNotificationTokenRequest tokenRequest);
    String sendNotificationByToken(NotificationMessageDTO notificationMessageDTO);
}
