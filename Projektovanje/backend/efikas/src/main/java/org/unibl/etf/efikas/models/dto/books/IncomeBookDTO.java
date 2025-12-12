package org.unibl.etf.efikas.models.dto.books;

import lombok.Builder;
import lombok.Data;
import org.unibl.etf.efikas.models.requests.BookRequest;

import java.util.List;


@Data
@Builder
public class IncomeBookDTO implements BookRequest {
    private TaxpayerDTO taxpayer;
    private StoreDTO store;
    @Builder.Default
    private IncomeEntry broughtState = IncomeEntry.builder().build();       // Doneseno stanje
    private List<IncomeEntry> entries;                                      // Svi prihodi poslije
}
