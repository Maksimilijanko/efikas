package org.unibl.etf.efikas.mappers;

import org.springframework.stereotype.Component;
import org.unibl.etf.efikas.models.Apartment;
import org.unibl.etf.efikas.models.responses.ApartmentResponse;

import java.util.List;

@Component
public class ApartmentMapper {

    public ApartmentResponse toDto(Apartment apartment, List<String> pictureUrls) {
        ApartmentResponse dto = new ApartmentResponse();
        dto.setApartmentId(apartment.getApartmentId());
        dto.setAddress(apartment.getAddress());
        dto.setNumberOfBeds(apartment.getNumberOfBeds());
        dto.setNumberOfRooms(apartment.getNumberOfRooms());
        dto.setCapacity(apartment.getCapacity());
        dto.setPricePerDay(apartment.getPricePerDay());
        dto.setPricePerNight(apartment.getPricePerNight());
        dto.setPictures(pictureUrls);
        return dto;
    }
}
