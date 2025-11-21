package org.unibl.etf.efikas.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.unibl.etf.efikas.models.entities.Reservation;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    Reservation findReservationByReservationId(Long reservationId);
}
