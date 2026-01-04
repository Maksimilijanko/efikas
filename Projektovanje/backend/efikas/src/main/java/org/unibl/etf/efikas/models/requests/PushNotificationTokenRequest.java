package org.unibl.etf.efikas.models.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PushNotificationTokenRequest {
    private String token;
    private String platform;
    private String email;
}
