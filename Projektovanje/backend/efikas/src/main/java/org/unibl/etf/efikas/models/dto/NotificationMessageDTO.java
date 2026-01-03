package org.unibl.etf.efikas.models.dto;

import lombok.Data;

import java.util.Map;

@Data
public class NotificationMessageDTO {
    private String recipientToken;
    private String title;
    private String body;
    private Map<String, String> data;
}
