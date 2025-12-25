package org.unibl.etf.efikas.models.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.unibl.etf.efikas.models.dto.GuestDTO;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateReservationRequest {
    private Integer apartmentId;
    private Integer guestId;
    private Integer guestQuantity;
    private Double price;
    private String note;
    private String reservationType;
}
