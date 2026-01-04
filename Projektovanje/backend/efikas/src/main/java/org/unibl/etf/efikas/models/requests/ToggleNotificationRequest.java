package org.unibl.etf.efikas.models.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ToggleNotificationRequest {
    private String pushToken;
    private boolean enabled;
}
