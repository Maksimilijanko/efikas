package org.unibl.etf.efikas.models.dto.books.entries;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.unibl.etf.efikas.models.enums.Gender;
import org.unibl.etf.efikas.models.responses.ApartmentResponse;

import java.time.Instant;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DomesticGuestsEntry {
    private Integer id;
    private ApartmentResponse apartment;
    private String name;
    private String surname;
    private Gender gender;
    private LocalDate birthDate;
    private String birthPlace;
    private String birthMunicipality;
    private String birthCountry;
    private String address;
    private String jmbg;
    private Integer accommodationUnitNumber;
    private Integer accommodationUnitFloor;
    private Instant dateTimeOfArrival;
    private Instant dateTimeOfDeparture;
    private Integer issuedInvoiceNumber;
    private String remarks;

}
