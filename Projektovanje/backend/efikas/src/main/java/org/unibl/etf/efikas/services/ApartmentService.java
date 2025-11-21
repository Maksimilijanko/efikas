package org.unibl.etf.efikas.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.unibl.etf.efikas.mappers.ApartmentMapper;
import org.unibl.etf.efikas.models.Apartment;
import org.unibl.etf.efikas.models.ApartmentPicture;
import org.unibl.etf.efikas.models.ApartmentPictureId;
import org.unibl.etf.efikas.models.dto.ApartmentCreateDTO;
import org.unibl.etf.efikas.models.responses.ApartmentResponse;
import org.unibl.etf.efikas.repositories.ApartmentPictureRepository;
import org.unibl.etf.efikas.repositories.ApartmentRepository;
import org.unibl.etf.efikas.repositories.AppUserRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApartmentService {

    private final ApartmentRepository apartmentRepository;
    private final ApartmentPictureRepository apartmentPictureRepository;
    private final ApartmentMapper mapper;
    private final AppUserRepository appUserRepository;

    public List<ApartmentResponse> getApartmentsForUser(String email) {
        return apartmentRepository.findByUserEmail(email).stream().map(a -> {
            return mapper.toDto(a, apartmentPictureRepository.findApartmentPictureByApartment(a).stream()
                    .map(p -> p.getId().getPictureURL()).toList());
        }).toList();
    }

    public ApartmentResponse createApartmentWithFiles(ApartmentCreateDTO request, List<MultipartFile> files, String email) {
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
        for (MultipartFile file : files) {
            String url = null;      // TODO: obtain S3 URL

            ApartmentPicture picture = new ApartmentPicture();
            picture.setApartment(savedApartment);

            ApartmentPictureId pictureId = new ApartmentPictureId();
            pictureId.setPictureURL(url);
            pictureId.setApartmentId(savedApartment.getApartmentId());

            picture.setId(pictureId);
            pictures.add(picture);
        }

        apartmentPictureRepository.saveAll(pictures);

        return mapper.toDto(savedApartment,
                pictures.stream().map(p -> p.getId().getPictureURL()).toList());
    }
}
