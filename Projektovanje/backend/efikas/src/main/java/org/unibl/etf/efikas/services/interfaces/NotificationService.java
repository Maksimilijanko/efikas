package org.unibl.etf.efikas.services.interfaces;

import org.unibl.etf.efikas.models.dto.NotificationMessageDTO;
import org.unibl.etf.efikas.models.requests.PushNotificationTokenRequest;
import org.unibl.etf.efikas.models.requests.ToggleNotificationRequest;

public interface NotificationService {
    /** Registers a notification push token unique to a device to the database.
     * @param tokenRequest DTO that encapsulates the token request for a user.
     *  */
    String addPushToken(PushNotificationTokenRequest tokenRequest);

    /** Sends a notification to a cloud provider.
     * @param notificationMessageDTO DTO that encapsulates the notification payload.
     *  */
    void sendNotificationByToken(NotificationMessageDTO notificationMessageDTO);

    /** Sends a notification to a cloud provider.
     * @param toggleNotificationRequest DTO that encapsulates notification toggling payload.
     *  */
    String toggleNotification(ToggleNotificationRequest toggleNotificationRequest);
}
