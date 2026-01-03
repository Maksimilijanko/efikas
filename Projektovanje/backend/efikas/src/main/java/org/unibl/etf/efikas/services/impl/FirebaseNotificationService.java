package org.unibl.etf.efikas.services.impl;

import com.google.firebase.ErrorCode;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.unibl.etf.efikas.models.dto.NotificationMessageDTO;
import org.unibl.etf.efikas.services.interfaces.NotificationService;

import java.io.IOException;

@Service
@AllArgsConstructor
public class FirebaseNotificationService implements NotificationService {

    private final FirebaseMessaging firebaseMessaging;


    @Override
    public String sendNotificationByToken(NotificationMessageDTO notificationMessageDTO) {

        Notification notification = Notification.builder()
                .setTitle(notificationMessageDTO.getTitle())
                .setBody(notificationMessageDTO.getBody())
                .build();

        Message message = Message.builder()
                .setToken(notificationMessageDTO.getRecipientToken())
                .setNotification(notification)
                .putAllData(notificationMessageDTO.getData())
                .build();

        try {
            if(firebaseMessaging == null)
                throw new RuntimeException("Firebase Messaging not initialized");

            firebaseMessaging.send(message);
            return "Notification sent successfully";
        } catch (FirebaseMessagingException | RuntimeException e) {
            e.printStackTrace();
            return "Error sending Notification";
        }
    }
}
