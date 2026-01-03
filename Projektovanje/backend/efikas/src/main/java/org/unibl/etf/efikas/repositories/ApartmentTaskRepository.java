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
            t.note, 
            p.pushToken, 
            t.dateTime
        )
        FROM ApartmentTask t
        JOIN t.apartment a
        JOIN a.user u
        JOIN NotificationPushToken p ON p.user = u
        WHERE t.dateTime BETWEEN :from AND :to
        AND t.status = false
    """)
    List<ApartmentTaskNotificationDTO> findUpcomingTaskNotifications(
            @Param("from") Instant from,
            @Param("to") Instant to
    );
}
