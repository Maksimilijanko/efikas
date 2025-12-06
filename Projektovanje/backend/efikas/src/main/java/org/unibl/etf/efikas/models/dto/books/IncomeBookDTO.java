package org.unibl.etf.efikas.models.dto.books;

import lombok.Builder;
import lombok.Data;
import org.unibl.etf.efikas.models.requests.BookRequest;

import java.util.List;


@Data
@Builder
public class IncomeBookDTO implements BookRequest {
    // TODO: make special dto's for taxpayer/store?
    private String taxpayerName;
    private String taxpayerJmbg;
    private String taxpayerAddress;
    private String storeName;
    private String storeAddress;
    private String activity;
    private String activityCode;
    private String jib;
    private List<IncomeEntry> entries;
}
