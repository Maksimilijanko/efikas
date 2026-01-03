package org.unibl.etf.efikas.services.interfaces;

import org.unibl.etf.efikas.models.dto.NotificationMessageDTO;

import java.util.Map;

public interface NotificationService {
    String sendNotificationByToken(NotificationMessageDTO notificationMessageDTO);
}
