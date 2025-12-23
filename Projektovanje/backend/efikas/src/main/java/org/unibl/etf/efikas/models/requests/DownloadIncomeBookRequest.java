package org.unibl.etf.efikas.models.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.unibl.etf.efikas.models.dto.DateRangeDTO;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DownloadIncomeBookRequest {
    private int taxpayerId;
    private int storeId;
    private DateRangeDTO period;
}
