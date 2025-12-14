package org.unibl.etf.efikas.models.requests;

import lombok.Builder;
import lombok.Data;
import org.unibl.etf.efikas.models.dto.DateRangeDTO;

@Data
@Builder
public class GuestsBookRequest {
    private DateRangeDTO period;
    private int apartmentId;
}
