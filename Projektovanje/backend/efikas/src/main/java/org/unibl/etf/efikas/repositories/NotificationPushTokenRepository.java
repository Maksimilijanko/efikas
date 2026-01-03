package org.unibl.etf.efikas.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.unibl.etf.efikas.models.entities.NotificationPushToken;

public interface NotificationPushTokenRepository extends JpaRepository<NotificationPushToken, Integer> {
    boolean existsByPushToken(String pushToken);
}
