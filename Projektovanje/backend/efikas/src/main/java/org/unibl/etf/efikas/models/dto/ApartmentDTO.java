package org.unibl.etf.efikas.models.dto;

import lombok.Data;

import java.util.Map;

@Data
public class ApartmentDTO {
    private String name;
    private String address;
    private Integer numberOfBeds;
    private Integer numberOfRooms;
    private Integer capacity;
    private Double pricePerNight;
    private Double pricePerDay;
    private Map<String, Boolean> traits;
}
