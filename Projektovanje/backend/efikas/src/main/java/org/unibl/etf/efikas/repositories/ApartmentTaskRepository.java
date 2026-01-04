package org.unibl.etf.efikas.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.unibl.etf.efikas.models.dto.ApartmentTaskNotificationDTO;
import org.unibl.etf.efikas.models.entities.ApartmentTask;
import org.unibl.etf.efikas.models.entities.ApartmentTaskId;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface ApartmentTaskRepository extends JpaRepository<ApartmentTask, Long> {
    List<ApartmentTask> findApartmentTaskByApartmentApartmentId(Integer apartment_apartmentId);
    Optional<ApartmentTask> findApartmentTaskById(ApartmentTaskId id);

    @Query("""
        SELECT new org.unibl.etf.efikas.models.dto.ApartmentTaskNotificationDTO(
            task.note, 
            notification.pushToken, 
            task.dateTime,
            notification.enabled
        )
        FROM ApartmentTask task
        JOIN task.apartment a
        JOIN a.user u
        JOIN NotificationPushToken notification ON notification.user = u
        WHERE task.dateTime BETWEEN :from AND :to
        AND task.status = false
    """)
    List<ApartmentTaskNotificationDTO> findUpcomingTaskNotifications(
            @Param("from") Instant from,
            @Param("to") Instant to
    );
}
