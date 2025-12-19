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
import org.unibl.etf.efikas.util.Constants;

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

        Apartment apartment = apartmentRepository.findById(apartmentId)
                .orElseThrow(() -> new EntityNotFoundException("Apartment not found!"));
        reservation.setApartment(apartment);

        FileUploadResponse fileUploadResponse = null;
        try {
            fileUploadResponse = s3Service.uploadFile(Constants.Aws.S3_BUCKET_IMAGES_FOLDER_PREFIX, documentPicture);
        } catch (IOException e) {
            throw new S3UploadException(e.getMessage());
        }
        String pictureUrl = fileUploadResponse.getFilePath();
        reservation.getGuest().setPersonalDocumentURL(pictureUrl);

        reservationRepository.save(reservation);
        return modelMapper.map(reservation, ReservationResponse.class);
    }

    @PreAuthorize("@userSecurity.isReservationOwner(authentication, #apartmentId)")
    public List<ReservationResponse> getAllReservations(Integer apartmentId, Authentication authentication) {
        List<Reservation> reservations = reservationRepository.findReservationByApartmentApartmentId(apartmentId);

        return reservations.stream()
                .map((element) -> modelMapper.map(element, ReservationResponse.class)).collect(Collectors.toList());
    }

    @PreAuthorize("@userSecurity.isReservationOwner(authentication, #reservationId)")
    public ReservationResponse getReservation(Integer reservationId, Authentication authentication) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reservation not found!"));

        return modelMapper.map(reservation, ReservationResponse.class);
    }

    @PreAuthorize("@userSecurity.isReservationOwner(authentication, #reservationId)")
    public ReservationResponse updateReservation(Integer reservationId, Authentication authentication, ReservationDTO reservationDTO, MultipartFile documentPicture) {
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
        reservation.setGuestQuantity(reservationDTO.getGuestQuantity());
        reservation.getGuest().setDateTimeOfArrival(reservationDTO.getGuest().getDateTimeOfArrival());
        reservation.getGuest().setDateTimeOfDeparture(reservationDTO.getGuest().getDateTimeOfDeparture());
        reservation.getGuest().setName(reservationDTO.getGuest().getName());
        reservation.getGuest().setSurname(reservationDTO.getGuest().getSurname());
        reservation.getGuest().setPhoneNumber(reservationDTO.getGuest().getPhoneNumber());

        // Delete old picture from S3 bucket
        s3Service.deleteFile(reservation.getGuest().getPersonalDocumentURL());

        // Upload the new picture to S3 bucket
        FileUploadResponse fileUploadResponse;
        try {
            fileUploadResponse = s3Service.uploadFile(Constants.Aws.S3_BUCKET_IMAGES_FOLDER_PREFIX, documentPicture);
        } catch (IOException e) {
            throw new S3UploadException(e.getMessage());
        }

        String pictureUrl = fileUploadResponse.getFilePath();
        reservation.getGuest().setPersonalDocumentURL(pictureUrl);

        reservationRepository.save(reservation);
        return modelMapper.map(reservation, ReservationResponse.class);
    }

    @PreAuthorize("@userSecurity.isReservationOwner(authentication, #reservationId)")
    public ReservationResponse deleteReservation(Integer reservationId, Authentication authentication) {
        Reservation reservation = reservationRepository.findReservationByReservationId(reservationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reservation not found!"));

        s3Service.deleteFile(reservation.getGuest().getPersonalDocumentURL());
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
