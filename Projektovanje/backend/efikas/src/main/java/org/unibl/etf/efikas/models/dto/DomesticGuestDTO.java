package org.unibl.etf.efikas.models.dto;

import com.fasterxml.jackson.annotation.JsonTypeName;
import lombok.*;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class DomesticGuestDTO extends GuestDTO {
    private String birthMunicipality;
}
