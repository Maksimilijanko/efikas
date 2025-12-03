package org.unibl.etf.efikas.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.unibl.etf.efikas.models.dto.ApartmentExpenseDTO;
import org.unibl.etf.efikas.models.dto.ReservationDTO;
import org.unibl.etf.efikas.models.entities.Apartment;
import org.unibl.etf.efikas.models.entities.Reservation;
import org.unibl.etf.efikas.models.entities.ReservationType;
import org.unibl.etf.efikas.models.responses.ApartmentExpenseResponse;
import org.unibl.etf.efikas.models.responses.ReservationResponse;
import org.unibl.etf.efikas.repositories.ApartmentRepository;
import org.unibl.etf.efikas.repositories.ReservationRepository;
import org.unibl.etf.efikas.repositories.ReservationTypeRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private ReservationRepository reservationRepository;
    private ReservationTypeRepository reservationTypeRepository;
    private ApartmentRepository apartmentRepository;
    private final ModelMapper modelMapper;

    @PreAuthorize("@userSecurity.isOwner(authentication, #apartmentId)")
    public ReservationResponse createNewReservation(Integer apartmentId, Authentication authentication,
                                                    ReservationDTO reservationDTO, MultipartFile documentPicture) {
        Reservation reservation = modelMapper.map(reservationDTO, Reservation.class);

        ReservationType reservationType = reservationTypeRepository
                .findReservationTypeByTypeName(reservationDTO.getReservationType())
                .orElseThrow(() -> new EntityNotFoundException("Reservation type not found!"));

        reservation.setType(reservationType);

        Apartment apartment = apartmentRepository.findById(apartmentId.longValue())
                .orElseThrow(() -> new EntityNotFoundException("Apartment not found!"));

        reservation.setApartment(apartment);

        reservationRepository.save(reservation);

        // TODO: picture saving

        return modelMapper.map(reservation, ReservationResponse.class);
    }

    @PreAuthorize("@userSecurity.isOwner(authentication, #apartmentId)")
    public List<ReservationResponse> getAllReservations(Integer apartmentId, Authentication authentication) {
        List<Reservation> reservations = reservationRepository.findReservationByApartmentApartmentId(apartmentId.longValue());

        return reservations.stream()
                .map((element) -> modelMapper.map(element, ReservationResponse.class)).collect(Collectors.toList());
    }


}
