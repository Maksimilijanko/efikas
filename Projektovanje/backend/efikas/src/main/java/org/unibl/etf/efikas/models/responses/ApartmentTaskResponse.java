package org.unibl.etf.efikas.models.responses;

import lombok.Data;

import java.time.Instant;

@Data
public class ApartmentTaskResponse {
    private Long apartmentId;
    private String name;
    private String note;
    private Boolean status;
    private Instant dateTime;
}
