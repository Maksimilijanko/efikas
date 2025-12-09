package org.unibl.etf.efikas.models.dto.itextpdf;

import lombok.Builder;
import lombok.Data;
import org.unibl.etf.efikas.models.enums.RowType;

/**
 * Represents a special cell DTO in the table (e.g. total income)
 * */
@Data
@Builder
public class SpecialRow {
    private String label;
    private int startColumn;
    private int endColumn;
    private RowType type;
}
