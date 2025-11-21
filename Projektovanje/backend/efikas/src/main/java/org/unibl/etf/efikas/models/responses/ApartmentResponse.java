package org.unibl.etf.efikas.models.responses;

import lombok.Data;
import java.util.List;

@Data
public class ApartmentResponse {
    private Integer apartmentId;
    private String address;
    private Integer numberOfBeds;
    private Integer numberOfRooms;
    private Integer capacity;
    private Double pricePerDay;
    private Double pricePerNight;
    private List<String> pictures;          // picture URLs
}
