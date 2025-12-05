package org.unibl.etf.efikas.models.dto.itextpdf;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class TableConfig {
    private float[] columnWidths;
    private boolean hasTitleRow;
    private boolean hasTotalRow;
    private String title;
    private List<MergedCell> mergedCells;
    private List<SpecialRow> specialRows;
}
