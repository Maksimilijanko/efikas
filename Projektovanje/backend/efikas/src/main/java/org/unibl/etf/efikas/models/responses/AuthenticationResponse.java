package org.unibl.etf.efikas.models.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.unibl.etf.efikas.models.dto.UserDTO;

@Data
@AllArgsConstructor
public class AuthenticationResponse {
    private UserDTO userDTO;
    private String accessToken;
}
