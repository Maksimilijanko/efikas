package org.unibl.etf.efikas.models.responses;

import lombok.Data;

@Data
public class AppUserResponse {
    private String name;
    private String surname;
    private String jib;
    private String email;
    private String address;
}
