package org.unibl.etf.efikas.services;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.unibl.etf.efikas.exceptions.S3UploadException;
import org.unibl.etf.efikas.models.dto.DomesticGuestDTO;
import org.unibl.etf.efikas.models.dto.ReservationDTO;
import org.unibl.etf.efikas.models.entities.Apartment;
import org.unibl.etf.efikas.models.entities.GuestsBook;
import org.unibl.etf.efikas.models.entities.Reservation;
import org.unibl.etf.efikas.models.entities.ReservationType;
import org.unibl.etf.efikas.models.requests.UpdateReservationRequest;
import org.unibl.etf.efikas.models.responses.FileUploadResponse;
import org.unibl.etf.efikas.models.responses.ReservationResponse;
import org.unibl.etf.efikas.repositories.ApartmentRepository;
import org.unibl.etf.efikas.repositories.GuestsBookRepository;
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
    private final GuestsBookRepository guestsBookRepository;

    @PreAuthorize("@userSecurity.isReservationOwner(authentication, #apartmentId)")
    public ReservationResponse createNewReservation(Integer apartmentId,
                                                    Authentication authentication,
                                                    ReservationDTO reservationDTO,
                                                    MultipartFile documentPicture
    ) {

        Reservation reservation = persistGuestIfNonExistant(reservationDTO);

        ReservationType reservationType = reservationTypeRepository
                .findReservationTypeByTypeName(reservationDTO.getReservationType())
                .orElseThrow(() -> new EntityNotFoundException("Reservation type not found!"));
        reservation.setType(reservationType);

        Apartment apartment = apartmentRepository.findById(apartmentId)
                .orElseThrow(() -> new EntityNotFoundException("Apartment not found!"));
        reservation.setApartment(apartment);



        if(documentPicture != null && !documentPicture.isEmpty()) {
            FileUploadResponse fileUploadResponse = null;
            try {
                fileUploadResponse = s3Service.uploadFile(Constants.Aws.S3_BUCKET_IMAGES_FOLDER_PREFIX, documentPicture);
            } catch (IOException e) {
                throw new S3UploadException(e.getMessage());
            }
            String pictureUrl = fileUploadResponse.getFilePath();
            reservation.getGuest().setPersonalDocumentURL(pictureUrl);  // Database gets the key stored
        }

        Reservation saved = reservationRepository.save(reservation);
        saved.getGuest().setPersonalDocumentURL(s3Service.getPresignedUrl(saved.getGuest().getPersonalDocumentURL()));  // User gets the downloadable URL

        return modelMapper.map(saved, ReservationResponse.class);
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

    @PreAuthorize("@userSecurity.isReservationOwner(authentication, #updateReservationRequest.getApartmentId())")
    public ReservationResponse updateReservation(Integer reservationId,
                                                 Authentication authentication,
                                                 UpdateReservationRequest updateReservationRequest,
                                                 MultipartFile documentPicture
    ) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reservation not found!"));

        Apartment apartment = apartmentRepository.findById(updateReservationRequest.getApartmentId())
                .orElseThrow(() -> new EntityNotFoundException("Apartment not found!"));

        ReservationType reservationType = reservationTypeRepository
                .findReservationTypeByTypeName(updateReservationRequest.getReservationType())
                .orElseThrow(() -> new EntityNotFoundException("Reservation type not found!"));


        reservation.setType(reservationType);
        reservation.setNote(updateReservationRequest.getNote());
        reservation.setPrice(updateReservationRequest.getPrice());
        reservation.setApartment(apartment);
        reservation.setGuestQuantity(updateReservationRequest.getGuestQuantity());
        reservation.setGuest(getGuestFromReservationDTO(updateReservationRequest));

        if(documentPicture != null && !documentPicture.isEmpty()) {
            // Delete old picture from S3 bucket
            s3Service.deleteFile(reservation.getGuest().getPersonalDocumentURL());

            FileUploadResponse fileUploadResponse;
            try {
                fileUploadResponse = s3Service.uploadFile(Constants.Aws.S3_BUCKET_IMAGES_FOLDER_PREFIX, documentPicture);
            } catch (IOException e) {
                throw new S3UploadException(e.getMessage());
            }
            String pictureUrl = fileUploadResponse.getFilePath();
            reservation.getGuest().setPersonalDocumentURL(pictureUrl);  // Database gets the key stored
        }

        Reservation saved = reservationRepository.save(reservation);
        String url = documentPicture != null ? s3Service.getPresignedUrl(saved.getGuest().getPersonalDocumentURL()) : null;
        saved.getGuest().setPersonalDocumentURL(url);  // User gets the downloadable URL
        return modelMapper.map(saved, ReservationResponse.class);
    }

    private GuestsBook getGuestFromReservationDTO(UpdateReservationRequest updateReservationRequest) {
        return modelMapper.map(updateReservationRequest.getGuest(), GuestsBook.class);
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

    private Reservation persistGuestIfNonExistant(ReservationDTO reservationDTO) {
        GuestsBook guest = guestsBookRepository
                .findByCitizenId(reservationDTO.getGuest().getCitizenId())
                .orElseGet(() -> guestsBookRepository.save(
                        modelMapper.map(reservationDTO.getGuest(), GuestsBook.class)
                ));

        Reservation reservation = modelMapper.map(reservationDTO, Reservation.class);
        reservation.setGuest(guest);

        return reservation;
    }
}