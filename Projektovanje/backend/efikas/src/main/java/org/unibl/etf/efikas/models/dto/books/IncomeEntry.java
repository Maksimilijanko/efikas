package org.unibl.etf.efikas.models.dto.books;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class IncomeEntry {
    private Integer ordinalNumber;
    private LocalDate accountingDate;
    private String description;
    private BigDecimal salesIncome;
    private BigDecimal otherIncome;
    private BigDecimal financialIncome;
    private BigDecimal totalIncome;
    private BigDecimal calculatedVat;
}
