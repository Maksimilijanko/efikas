package org.unibl.etf.efikas.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.unibl.etf.efikas.models.entities.NotificationPushToken;

import java.util.Optional;

public interface NotificationPushTokenRepository extends JpaRepository<NotificationPushToken, Integer> {
    boolean existsByPushToken(String pushToken);
    Optional<NotificationPushToken> findByPushToken(String pushToken);
}
