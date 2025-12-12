package org.unibl.etf.efikas.models.requests;

import lombok.Builder;
import lombok.Data;
import org.unibl.etf.efikas.models.dto.books.StoreDTO;
import org.unibl.etf.efikas.models.dto.books.TaxpayerDTO;

import java.time.LocalDate;

@Data
@Builder
public class FinancialBookPdfRequest {
    /**
     * "from" date will be 01.01 of current fiscal year
     * */
    @Builder.Default
    private LocalDate from = LocalDate.of(LocalDate.now().getYear(), 1, 1);
    /**
     * "to" date will be the current day of current fiscal year
     * */
    @Builder.Default
    private LocalDate to = LocalDate.now();

    private TaxpayerDTO taxpayer;
    private StoreDTO store;
}
