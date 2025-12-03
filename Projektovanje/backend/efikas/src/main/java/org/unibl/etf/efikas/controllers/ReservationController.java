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
@RequestMapping("/api/v1/apartments")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping(value = "/{apartmentId}/", consumes = "multipart/form-data")
    public ResponseEntity<?> createReservation(@PathVariable Integer apartmentId,
                                               @RequestPart("reservation") ReservationDTO reservationDTO,
                                               @RequestPart("picture") MultipartFile documentPicture) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        ReservationResponse response = reservationService.createNewReservation(apartmentId, authentication,
                reservationDTO, documentPicture);

        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/{apartmentId}/")
    public ResponseEntity<?> getReservations(@PathVariable Integer apartmentId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        List<ReservationResponse> response = reservationService.getAllReservations(apartmentId, authentication);

        return ResponseEntity.ok(response);
    }

}
