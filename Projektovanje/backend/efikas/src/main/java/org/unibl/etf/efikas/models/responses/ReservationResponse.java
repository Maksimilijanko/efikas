package org.unibl.etf.efikas.models.responses;

import lombok.Data;
import java.time.Instant;

@Data
public class ReservationResponse {
    private Integer reservationId;
    private ApartmentResponse apartment;
    private String guestFullName;
    private String guestPhoneNumber;
    private Instant dateTimeOfArrival;
    private Instant dateTimeOfDeparture;
    private Integer guestNumber;
    private Double price;
    private String note;
    private String personalDocumentURL;         // document picture URL
    private String reservationType;
}
