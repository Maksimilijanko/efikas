package org.unibl.etf.efikas.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.unibl.etf.efikas.mappers.ApartmentMapper;
import org.unibl.etf.efikas.models.responses.ApartmentResponse;
import org.unibl.etf.efikas.repositories.ApartmentPictureRepository;
import org.unibl.etf.efikas.repositories.ApartmentRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApartmentService {

    private final ApartmentRepository apartmentRepository;
    private final ApartmentPictureRepository apartmentPictureRepository;
    private final ApartmentMapper mapper;

    public List<ApartmentResponse> getApartmentsForUser(String email) {
        return apartmentRepository.findByUserEmail(email).stream().map(a -> {
            return mapper.toDto(a, apartmentPictureRepository.findApartmentPictureByApartment(a).stream()
                    .map(p -> p.getId().getPictureURL()).toList());
        }).toList();
    }
}
