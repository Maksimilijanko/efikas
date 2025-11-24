package org.unibl.etf.efikas.models.dto;

import lombok.Data;

@Data
public class ApartmentExpenseDTO {
    private String name;
    private Double amount;
    private String note;
    private Boolean status;
}
