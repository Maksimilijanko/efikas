package org.unibl.etf.efikas.repositories;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
public class ReservationRepositoryTest {

    @Autowired
    private ReservationRepository reservationRepository;

    @Test
    void shouldPrintAllReservations() {
        List<Reservation> reservations = reservationRepository.findAll();

        if (reservations.isEmpty()) {
            System.out.println("⚠️  Tabela 'reservation' je prazna.");
        } else {
            System.out.println("✅ Svi redovi iz tabele 'reservation':");
            reservations.forEach(r -> System.out.println(
                    "ID: " + r.getReservationId() +
                            ", Guest name: " + r.getGuestFullName()
            ));
        }
    }
}
