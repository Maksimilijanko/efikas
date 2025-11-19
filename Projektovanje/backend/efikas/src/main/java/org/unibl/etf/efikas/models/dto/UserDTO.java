package org.unibl.etf.efikas.models.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class UserDTO {
    private String name;
    private String surname;
    private String jib;
    private String email;
}
