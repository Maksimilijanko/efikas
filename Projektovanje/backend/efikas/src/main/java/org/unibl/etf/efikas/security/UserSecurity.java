package org.unibl.etf.efikas.security;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.unibl.etf.efikas.models.entities.Apartment;
import org.unibl.etf.efikas.models.entities.Reservation;
import org.unibl.etf.efikas.repositories.ApartmentRepository;
import org.unibl.etf.efikas.repositories.ReservationRepository;

@Component("userSecurity")
@RequiredArgsConstructor
public class UserSecurity {

    private final ApartmentRepository apartmentRepository;
    private final ReservationRepository reservationRepository;

    // Check if the user is the owner of the apartment
    public boolean isOwner(Authentication authentication, Long apartmentId) {
        String email = authentication.getName();

        return apartmentRepository.findById(apartmentId)
                .map(Apartment::getUser)
                .map(user -> user.getEmail().equals(email))
                .orElse(false);
    }

    public boolean isOwnerOfReservation(Authentication authentication, Long reservationId) {
        String email = authentication.getName();

        // We need to check here for existence, so we can get 404 back instead of 403.
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reservation not found!"));

        return reservationRepository.findById(reservationId)
                .map(Reservation::getApartment)
                .map(Apartment::getUser)
                .map(user -> user.getEmail().equals(email))
                .orElse(false);
    }
}
