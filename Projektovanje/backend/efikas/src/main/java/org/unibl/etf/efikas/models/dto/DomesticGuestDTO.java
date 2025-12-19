package org.unibl.etf.efikas.models.dto;

import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
public class DomesticGuestDTO extends GuestDTO {
    private String birthMunicipality;
}
