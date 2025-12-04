package org.unibl.etf.efikas.models.dto;

import lombok.Data;

import java.time.Instant;

@Data
public class ReservationDTO {
    private String guestFullName;
    private String guestPhoneNumber;
    private Integer guestNumber;
    private String note;
    private String reservationType;
    private Double price;
    private Instant dateTimeOfArrival;
    private Instant dateTimeOfDeparture;
    private Long apartmentId;
}
