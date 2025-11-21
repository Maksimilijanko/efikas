package org.unibl.etf.efikas.models.dto;

import lombok.Data;
import java.util.List;

@Data
public class ApartmentDTO {

    private String address;
    private Integer numberOfBeds;
    private Integer numberOfRooms;
    private Integer capacity;
    private Double pricePerNight;
    private Double pricePerDay;

}
