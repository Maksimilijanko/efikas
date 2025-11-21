package org.unibl.etf.efikas.services;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.unibl.etf.efikas.exceptions.FileUploadException;
import org.unibl.etf.efikas.models.dto.ApartmentDTO;
import org.unibl.etf.efikas.models.entities.Apartment;
import org.unibl.etf.efikas.models.entities.ApartmentPicture;
import org.unibl.etf.efikas.models.entities.ApartmentPictureId;
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
                            .map(p -> p.getId().getPictureURL())
                            .toList();

                    resp.setPictures(pictures);
                    return resp;
                })
                .toList();
    }

    public ApartmentResponse createApartmentWithFiles(ApartmentDTO request, List<MultipartFile> files, String email) {
        Apartment apartment = new Apartment();
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
                throw new FileUploadException(e.getMessage());
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
}
