package org.unibl.etf.efikas.models.requests;

import lombok.Data;

@Data
public class OtpVerifyRequest {
    private String email;
    private String otp;
}
