package org.unibl.etf.efikas.models.dto.books;

import lombok.Builder;
import lombok.Data;
import org.unibl.etf.efikas.models.dto.ApartmentDTO;
import org.unibl.etf.efikas.models.entities.Apartment;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Represents the raw data (rows) of the income table.
 * */
@Data
@Builder
public class IncomeEntry {
    @Builder.Default
    private Integer id = 0;
    private ApartmentDTO apartment;
    @Builder.Default
    private LocalDate accountingDate =  LocalDate.now();
    @Builder.Default
    private String description = "";
    @Builder.Default
    private BigDecimal productSaleRevenue = BigDecimal.ZERO;
    @Builder.Default
    private BigDecimal goodsSaleRevenue = BigDecimal.ZERO;
    @Builder.Default
    private BigDecimal serviceSaleRevenue = BigDecimal.ZERO;
    @Builder.Default
    private BigDecimal otherRevenue = BigDecimal.ZERO;
    @Builder.Default
    private BigDecimal financialRevenue = BigDecimal.ZERO;
    @Builder.Default
    private BigDecimal totalRevenue = BigDecimal.ZERO;
    @Builder.Default
    private BigDecimal vatAmount = BigDecimal.ZERO;


}
