package org.unibl.etf.efikas.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.unibl.etf.efikas.models.entities.Apartment;
import org.unibl.etf.efikas.models.entities.Reservation;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    Optional<Reservation> findReservationByReservationId(Long reservationId);
    List<Reservation> findReservationByApartmentApartmentId(Long apartmentId);
    List<Reservation> findReservationByApartmentUserEmail(String email);
}
