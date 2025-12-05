package org.unibl.etf.efikas.models.responses;

import lombok.Data;

@Data
public class CashRegisterResponse {
    private Integer cashRegisterNumber;
    private String softwareVersion;
}
