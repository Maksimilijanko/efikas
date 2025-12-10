package org.unibl.etf.efikas.models.dto.books;

import lombok.Builder;
import lombok.Data;
import org.unibl.etf.efikas.models.requests.BookRequest;

import java.util.List;


@Data
@Builder
public class IncomeBookDTO implements BookRequest {
    // TODO: make special dto's for taxpayer/store?
    private TaxpayerDTO taxpayer;
    private StoreDTO store;
    private List<IncomeEntry> entries;
}
