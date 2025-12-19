package org.unibl.etf.efikas.models.dto;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.ColumnDefault;
import org.unibl.etf.efikas.models.enums.Gender;

import java.time.Instant;
import java.time.LocalDate;

@Data
@SuperBuilder
@AllArgsConstructor
public abstract class GuestDTO {
    private Integer id;
    private String citizenId;
    private Boolean isLocal;
    private String personalDocumentURL;
    private String name;
    private String surname;
    private Gender gender;
    private String phoneNumber;
    private LocalDate birthDate;
    private String birthPlace;

    private String birthCountry;
    private String address;

    private Integer accommodationUnitNumber;
    private Integer accommodationUnitFloor;
    private Instant dateTimeOfArrival;
    private Instant dateTimeOfDeparture;
    private String issuedInvoiceNumber;
    private String remarks;
    private Instant createdAt;
}
