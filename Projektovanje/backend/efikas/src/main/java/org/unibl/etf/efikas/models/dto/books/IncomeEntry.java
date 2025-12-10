package org.unibl.etf.efikas.models.dto.books;

import lombok.Builder;
import lombok.Data;
import org.unibl.etf.efikas.models.entities.Apartment;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Represents the raw data (rows) of the income table.
 * */
@Data
@Builder
public class IncomeEntry {
    private Integer ordinalNumber;
    private Apartment apartment;
    private LocalDate accountingDate;
    private String description;
    private BigDecimal productSaleRevenue;
    private BigDecimal goodsSaleRevenue;
    private BigDecimal serviceSaleRevenue;
    private BigDecimal otherRevenue;
    private BigDecimal financialRevenue;
    private BigDecimal totalRevenue;
    private BigDecimal vatAmount;
}
