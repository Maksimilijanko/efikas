package org.unibl.etf.efikas.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.unibl.etf.efikas.exceptions.S3UploadException;
import org.unibl.etf.efikas.models.dto.ReservationDTO;
import org.unibl.etf.efikas.models.entities.Apartment;
import org.unibl.etf.efikas.models.entities.Reservation;
import org.unibl.etf.efikas.models.entities.ReservationType;
import org.unibl.etf.efikas.models.responses.FileUploadResponse;
import org.unibl.etf.efikas.models.responses.ReservationResponse;
import org.unibl.etf.efikas.repositories.ApartmentRepository;
import org.unibl.etf.efikas.repositories.ReservationRepository;
import org.unibl.etf.efikas.repositories.ReservationTypeRepository;
import org.unibl.etf.efikas.services.interfaces.S3Service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ReservationTypeRepository reservationTypeRepository;
    private final ApartmentRepository apartmentRepository;
    private final ModelMapper modelMapper;
    private final S3Service s3Service;

    @PreAuthorize("@userSecurity.isReservationOwner(authentication, #apartmentId)")
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

        FileUploadResponse fileUploadResponse = null;
        try {
            fileUploadResponse = s3Service.uploadFile(documentPicture);
        } catch (IOException e) {
            throw new S3UploadException(e.getMessage());
        }
        String pictureUrl = fileUploadResponse.getFilePath();
        reservation.setPersonalDocumentURL(pictureUrl);

        reservationRepository.save(reservation);
        return modelMapper.map(reservation, ReservationResponse.class);
    }

    @PreAuthorize("@userSecurity.isReservationOwner(authentication, #apartmentId)")
    public List<ReservationResponse> getAllReservations(Integer apartmentId, Authentication authentication) {
        List<Reservation> reservations = reservationRepository.findReservationByApartmentApartmentId(apartmentId.longValue());

        return reservations.stream()
                .map((element) -> modelMapper.map(element, ReservationResponse.class)).collect(Collectors.toList());
    }

    @PreAuthorize("@userSecurity.isReservationOwner(authentication, #reservationId)")
    public ReservationResponse getReservation(Long reservationId, Authentication authentication) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reservation not found!"));

        return modelMapper.map(reservation, ReservationResponse.class);
    }

    @PreAuthorize("@userSecurity.isReservationOwner(authentication, #reservationId)")
    public ReservationResponse updateReservation(Long reservationId, Authentication authentication, ReservationDTO reservationDTO, MultipartFile documentPicture) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reservation not found!"));

        Apartment apartment = apartmentRepository.findById(reservationDTO.getApartmentId())
                .orElseThrow(() -> new EntityNotFoundException("Apartment not found!"));

        ReservationType reservationType = reservationTypeRepository
                .findReservationTypeByTypeName(reservationDTO.getReservationType())
                .orElseThrow(() -> new EntityNotFoundException("Reservation type not found!"));

        reservation.setType(reservationType);
        reservation.setNote(reservationDTO.getNote());
        reservation.setPrice(reservationDTO.getPrice());
        reservation.setApartment(apartment);
        reservation.setGuestNumber(reservationDTO.getGuestNumber());
        reservation.setDateTimeOfArrival(reservationDTO.getDateTimeOfArrival());
        reservation.setDateTimeOfDeparture(reservationDTO.getDateTimeOfDeparture());
        reservation.setGuestFullName(reservationDTO.getGuestFullName());
        reservation.setGuestPhoneNumber(reservationDTO.getGuestPhoneNumber());

        // Delete old picture from S3 bucket
        s3Service.deleteFile(reservation.getPersonalDocumentURL());

        // Upload the new picture to S3 bucket
        FileUploadResponse fileUploadResponse;
        try {
            fileUploadResponse = s3Service.uploadFile(documentPicture);
        } catch (IOException e) {
            throw new S3UploadException(e.getMessage());
        }

        String pictureUrl = fileUploadResponse.getFilePath();
        reservation.setPersonalDocumentURL(pictureUrl);

        reservationRepository.save(reservation);
        return modelMapper.map(reservation, ReservationResponse.class);
    }

    @PreAuthorize("@userSecurity.isReservationOwner(authentication, #reservationId)")
    public ReservationResponse deleteReservation(Long reservationId, Authentication authentication) {
        Reservation reservation = reservationRepository.findReservationByReservationId(reservationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reservation not found!"));

        s3Service.deleteFile(reservation.getPersonalDocumentURL());
        reservationRepository.delete(reservation);

        return modelMapper.map(reservation, ReservationResponse.class);
    }

    public List<ReservationResponse> getAllReservationsForUser(Authentication authentication) {
        String email = authentication.getName();

        List<Reservation> reservations = reservationRepository.findReservationByApartmentUserEmail(email);

        return reservations.stream()
                .map((element) -> modelMapper.map(element, ReservationResponse.class))
                .collect(Collectors.toList());
    }

}
