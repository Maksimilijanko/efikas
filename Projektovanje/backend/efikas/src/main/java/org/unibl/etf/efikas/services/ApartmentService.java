package org.unibl.etf.efikas.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.unibl.etf.efikas.exceptions.S3UploadException;
import org.unibl.etf.efikas.models.entities.Apartment;
import org.unibl.etf.efikas.models.entities.ApartmentPicture;
import org.unibl.etf.efikas.models.entities.ApartmentPictureId;
import org.unibl.etf.efikas.models.dto.ApartmentDTO;
import org.unibl.etf.efikas.models.responses.ApartmentResponse;
import org.unibl.etf.efikas.models.responses.FileUploadResponse;
import org.unibl.etf.efikas.repositories.ApartmentPictureRepository;
import org.unibl.etf.efikas.repositories.ApartmentRepository;
import org.unibl.etf.efikas.repositories.AppUserRepository;
import org.unibl.etf.efikas.services.interfaces.S3Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApartmentService {

    private final ApartmentRepository apartmentRepository;
    private final ApartmentPictureRepository apartmentPictureRepository;
    private final AppUserRepository appUserRepository;
    private final ModelMapper modelMapper;
    private final S3Service s3Service;

    public List<ApartmentResponse> getApartmentsForUser(String email) {
        return apartmentRepository.findByUserEmail(email).stream()
                .map(a -> {
                    ApartmentResponse resp = modelMapper.map(a, ApartmentResponse.class);

                    List<String> pictures = apartmentPictureRepository
                            .findApartmentPictureByApartment(a)
                            .stream()
                            .map(p -> s3Service.getPresignedUrl(p.getId().getPictureURL()))
                            .toList();

                    resp.setPictures(pictures);
                    return resp;
                })
                .toList();
    }

    public ApartmentResponse createApartmentWithFiles(ApartmentDTO request, List<MultipartFile> files, String email) {
        Apartment apartment = new Apartment();
        return getApartmentResponseCreate(request, files, email, apartment);
    }

    public ApartmentResponse createApartmentWithFiles(Integer id, ApartmentDTO request, List<MultipartFile> files, String email) {
        Apartment apartment = new Apartment();
        apartment.setApartmentId(id);
        return getApartmentResponseCreate(request, files, email, apartment);
    }

    private ApartmentResponse getApartmentResponseCreate(ApartmentDTO request, List<MultipartFile> files, String email, Apartment apartment) {
        apartment.setAddress(request.getAddress());
        apartment.setNumberOfBeds(request.getNumberOfBeds());
        apartment.setNumberOfRooms(request.getNumberOfRooms());
        apartment.setCapacity(request.getCapacity());
        apartment.setPricePerDay(request.getPricePerDay());
        apartment.setPricePerNight(request.getPricePerNight());
        apartment.setUser(appUserRepository.findByEmail(email).orElse(null));

        Apartment savedApartment = apartmentRepository.save(apartment);

        List<ApartmentPicture> pictures = new ArrayList<>();
        FileUploadResponse s3UploadResponse;
        for (MultipartFile file : files) {
            try {
                s3UploadResponse = s3Service.uploadFile(file);
            } catch (IOException e) {
                throw new S3UploadException(e.getMessage());
            }
            String url = s3UploadResponse.getFilePath();

            ApartmentPicture picture = new ApartmentPicture();
            picture.setApartment(savedApartment);

            ApartmentPictureId pictureId = new ApartmentPictureId();
            pictureId.setPictureURL(url);
            pictureId.setApartmentId(savedApartment.getApartmentId());

            picture.setId(pictureId);
            pictures.add(picture);
        }

        apartmentPictureRepository.saveAll(pictures);

        ApartmentResponse response = modelMapper.map(savedApartment, ApartmentResponse.class);
        response.setPictures(
                pictures.stream().map(p -> s3Service.getPresignedUrl(p.getId().getPictureURL())).toList()
        );

        return response;
    }

    public ApartmentResponse updateApartment(
            Integer apartmentId,
            ApartmentDTO dto,
            List<MultipartFile> newPictures,
            String userEmail
    ) throws IOException {

        Apartment apartment = apartmentRepository.findById(apartmentId.longValue())
                .orElseThrow(() -> new EntityNotFoundException("Apartment not found"));

        // Throw an exception if the apartment belongs to a different user
        if (!apartment.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Forbidden");
        }

        apartment.setAddress(dto.getAddress());
        apartment.setNumberOfRooms(dto.getNumberOfRooms());
        apartment.setNumberOfBeds(dto.getNumberOfBeds());
        apartment.setCapacity(dto.getCapacity());
        apartment.setPricePerDay(dto.getPricePerDay());
        apartment.setPricePerNight(dto.getPricePerNight());

        Apartment updatedApartment = apartmentRepository.save(apartment);

        /* Steps for updating pictures on S3
        * (1) Upload new images with new keys
        * (2) Delete images on S3 with old keys
        * (3) Update database with new keys
        * (4) ???
        * (5) Profit
        * */
        // Upload new images
        List<String> newKeys = new ArrayList<>();
        for (MultipartFile file : newPictures) {
            FileUploadResponse uploaded = s3Service.uploadFile(file);
            newKeys.add(uploaded.getFilePath());
        }

        // Delete old files and DB entries
        List<ApartmentPicture> pictures = apartmentPictureRepository.findApartmentPictureByApartment(updatedApartment);
        pictures.forEach(p -> s3Service.deleteFile(p.getId().getPictureURL()));
        apartmentPictureRepository.deleteAll(pictures);

        // Add new DB entries with new keys
        for (String key : newKeys) {
            ApartmentPictureId newApartmentPictureId = new ApartmentPictureId();
            newApartmentPictureId.setApartmentId(updatedApartment.getApartmentId());
            newApartmentPictureId.setPictureURL(key);

            ApartmentPicture picture = new ApartmentPicture();
            picture.setId(newApartmentPictureId);
            picture.setApartment(updatedApartment);

            apartmentPictureRepository.save(picture);
        }

        ApartmentResponse response = modelMapper.map(updatedApartment, ApartmentResponse.class);
        response.setPictures(newKeys);

        return response;
    }

    public ApartmentResponse deleteApartment(Integer apartmentId) throws IOException {
        Apartment apartment = apartmentRepository.findById(apartmentId.longValue())
                .orElseThrow(() -> new EntityNotFoundException("Apartment not found"));

        List<ApartmentPicture> pictures = apartmentPictureRepository.findApartmentPictureByApartment(apartment);
        ApartmentResponse response = modelMapper.map(apartment, ApartmentResponse.class);
        // 1. Set the appropriate URLs first (only keys, not presigned urls)
        response.setPictures(
                pictures.stream().map(p -> p.getId().getPictureURL()).toList()
        );

        // delete children first, then apartment
        apartmentPictureRepository.deleteAll(pictures);
        apartmentRepository.delete(apartment);

        // 2. Delete them on S3
        response.getPictures().forEach(s3Service::deleteFile);

        return response;
    }
}
