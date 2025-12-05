package org.unibl.etf.efikas.models.responses;

import lombok.Data;

@Data
public class CashRegisterResponse {
    private Integer cashRegisterId;
    private Integer cashRegisterNumber;
    private String softwareVersion;
}
