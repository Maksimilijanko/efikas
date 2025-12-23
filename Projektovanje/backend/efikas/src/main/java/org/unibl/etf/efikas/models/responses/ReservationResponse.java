package org.unibl.etf.efikas.models.responses;

import lombok.Data;
import org.unibl.etf.efikas.models.dto.GuestDTO;

import java.time.Instant;

@Data
public class ReservationResponse {
    private Integer reservationId;
    private ApartmentResponse apartment;
    private GuestDTO guest;
    private Integer guestQuantity;
    private Double price;
    private String note;
    private String reservationType;
}
