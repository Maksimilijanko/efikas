package org.unibl.etf.efikas.models.dto;

import lombok.Data;

@Data
public class ChangePasswordDTO {
    private String email;
    private String newPassword;
    private String confirmPassword;
    private String otp;
}
