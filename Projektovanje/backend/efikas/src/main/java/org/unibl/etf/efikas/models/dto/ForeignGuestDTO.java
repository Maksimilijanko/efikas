package org.unibl.etf.efikas.models.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
public class ForeignGuestDTO extends GuestDTO {
    private String citizenship;
    private String passportNumber;
    private LocalDate passportIssuedDate;
    private String visaType;
    private String visaNumber;
    private LocalDate permittedResidenceDate;
    private LocalDate entryDate;
    private String entryPlace;
}
