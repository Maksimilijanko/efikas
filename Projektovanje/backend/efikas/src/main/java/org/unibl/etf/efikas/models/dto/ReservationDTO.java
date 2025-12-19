package org.unibl.etf.efikas.models.dto;

import lombok.Data;

import java.time.Instant;

@Data
public class ReservationDTO {
    private Integer apartmentId;
    private GuestDTO guest;
    private Integer guestQuantity;
    private Double price;
    private String note;
    private String reservationType;
}
