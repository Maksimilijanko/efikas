package org.unibl.etf.efikas.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.unibl.etf.efikas.models.dto.ApartmentDTO;
import org.unibl.etf.efikas.models.dto.ReservationDTO;
import org.unibl.etf.efikas.models.responses.ReservationResponse;
import org.unibl.etf.efikas.services.ReservationService;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping(value = "/apartments/{apartmentId}/reservations", consumes = "multipart/form-data")
    public ResponseEntity<?> createReservation(@PathVariable Integer apartmentId,
                                               @RequestPart("reservation") ReservationDTO reservationDTO,
                                               @RequestPart("picture") MultipartFile documentPicture) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        // For POST, we are extracting apartmentId from the endpoint URL itself.
        // We are not relying on the value found in DTO.
        ReservationResponse response = reservationService.createNewReservation(apartmentId, authentication,
                reservationDTO, documentPicture);

        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/apartments/{apartmentId}/reservations")
    public ResponseEntity<?> getReservations(@PathVariable Integer apartmentId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        List<ReservationResponse> response = reservationService.getAllReservations(apartmentId, authentication);

        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/reservations/{reservationId}")
    public ResponseEntity<?> getReservation(@PathVariable Long reservationId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        ReservationResponse response = reservationService.getReservation(reservationId, authentication);

        return ResponseEntity.ok(response);
    }

    @PutMapping(value = "/reservations/{reservationId}", consumes = "multipart/form-data")
    public ResponseEntity<?> updateReservation(@PathVariable Long reservationId,
                                               @RequestPart("reservation") ReservationDTO reservationDTO,
                                               @RequestPart("picture") MultipartFile documentPicture) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        ReservationResponse response = reservationService
                .updateReservation(reservationId, authentication, reservationDTO, documentPicture);

        // TODO: implement upsert behavior

        return ResponseEntity.ok(response);
    }

    @DeleteMapping(value = "/reservations/{reservationId}")
    public ResponseEntity<?> deleteReservation(@PathVariable Long reservationId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        ReservationResponse response = reservationService.deleteReservation(reservationId, authentication);

        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/reservations")
    public ResponseEntity<?> getAllUserReservations() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        List<ReservationResponse> response = reservationService.getAllReservationsForUser(authentication);

        return ResponseEntity.ok(response);
    }

}
