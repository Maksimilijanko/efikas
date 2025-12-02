package org.unibl.etf.efikas.models.responses;

import lombok.Data;
import org.unibl.etf.efikas.models.entities.Apartment;

import java.time.Instant;

@Data
public class ReservationResponse {
    private Apartment apartment;
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
