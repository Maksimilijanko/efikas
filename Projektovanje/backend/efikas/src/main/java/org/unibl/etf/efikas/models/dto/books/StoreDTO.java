package org.unibl.etf.efikas.models.dto.books;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StoreDTO {
    private String name;
    private String address;
    private String activity;
    private String activityCode;
    private String jib;
}
