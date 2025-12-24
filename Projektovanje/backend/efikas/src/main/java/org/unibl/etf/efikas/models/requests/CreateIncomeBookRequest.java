package org.unibl.etf.efikas.models.requests;

import lombok.Builder;
import lombok.Data;
import org.unibl.etf.efikas.models.dto.books.entries.IncomeEntry;
import org.unibl.etf.efikas.models.responses.ApartmentResponse;

import java.math.BigDecimal;
import java.util.Objects;
import java.util.stream.Stream;

@Data
@Builder
public class CreateIncomeBookRequest {
    private int apartmentId;
    private String description;
    private BigDecimal productSaleRevenue;
    private BigDecimal goodsSaleRevenue;
    private BigDecimal serviceSaleRevenue;
    private BigDecimal otherRevenue;
    private BigDecimal financialRevenue;
    private BigDecimal vatAmount;

    public BigDecimal calculateTotalRevenue() {
        return Stream.of(
                        productSaleRevenue,
                        goodsSaleRevenue,
                        serviceSaleRevenue,
                        otherRevenue,
                        financialRevenue
                )
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public IncomeEntry toIncomeEntry() {
        return IncomeEntry.builder()
                .apartment(new ApartmentResponse())
                .description(this.description)
                .productSaleRevenue(this.productSaleRevenue)
                .goodsSaleRevenue(this.goodsSaleRevenue)
                .serviceSaleRevenue(this.serviceSaleRevenue)
                .otherRevenue(this.otherRevenue)
                .financialRevenue(this.financialRevenue)
                .vatAmount(this.vatAmount)
                .totalRevenue(this.calculateTotalRevenue())
                .build();
    }
}
