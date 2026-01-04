package org.unibl.etf.efikas.services.schedulers;

import lombok.AllArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.unibl.etf.efikas.models.dto.ApartmentTaskNotificationDTO;
import org.unibl.etf.efikas.models.dto.NotificationMessageDTO;
import org.unibl.etf.efikas.services.ApartmentTaskService;
import org.unibl.etf.efikas.services.interfaces.NotificationService;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@AllArgsConstructor
public class NotificationScheduler {
    private final ApartmentTaskService apartmentTaskService;
    private final NotificationService notificationService;

    // Runs every day at 9 AM

    @Scheduled(cron = "30 46 18 * * *")
    public void scheduleDailyReminders() {
        String delimiter = "*".repeat(15);
        System.out.println(delimiter + " ⏱ Scheduling daily reminders - SENDING NOTIFICATIONS " + delimiter);

        LocalDate today = LocalDate.now(ZoneId.systemDefault());
        Instant from = today.minusDays(2)
                .atStartOfDay(ZoneId.systemDefault())
                .toInstant();
        Instant to = today
                .plusDays(1)
                .atStartOfDay(ZoneId.systemDefault())
                .toInstant();

        // Find tasks due today, tomorrow, and the day after
        List<ApartmentTaskNotificationDTO> upcomingTasks = apartmentTaskService.getAllByDueDateTimeBetween(from, to);
        System.out.println("Upcoming tasks: " + upcomingTasks);

        for (var task : upcomingTasks) {
            String message = "Reminder: Your task '" + task.getName() + "' is due soon! (" + toLocalDateTimeString(task.getDateTime()) + ")" ;
            String token = task.getToken();
            if(!task.isUserEnabledNotification()){
                continue;
            }

            // Call the async method to send it
            NotificationMessageDTO notificationMessageDTO = NotificationMessageDTO.builder()
                    .recipientToken(token)
                    .title("Reminder")
                    .body(message)
                    .build();
            notificationService.sendNotificationByToken(notificationMessageDTO);
        }
    }

    private String toLocalDateTimeString(Instant instant) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        ZoneId zoneId = ZoneId.systemDefault();

        ZonedDateTime zonedDateTime = instant.atZone(zoneId);
        return formatter.format(zonedDateTime); // formatter returns a String
    }
}
