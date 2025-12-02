package org.unibl.etf.efikas.models.dto;

import lombok.Data;

@Data
public class ReservationDTO {
    private String guestFullName;
    private String guestPhoneNumber;
    private Integer guestNumber;
    private String note;
    private String reservationType;
    private Double price;
    private String dateTimeOfArrival;
    private String dateTimeOfDeparture;
    private String personalDocumentURL;
}
