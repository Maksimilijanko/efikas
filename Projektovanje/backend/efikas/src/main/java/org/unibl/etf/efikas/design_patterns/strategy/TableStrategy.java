package org.unibl.etf.efikas.design_patterns.strategy;

import com.itextpdf.layout.element.Table;
import org.unibl.etf.efikas.models.dto.itextpdf.TableData;
import org.unibl.etf.efikas.models.enums.TableType;

public interface TableStrategy {
    Table createTable(TableData tableData);
    TableType getTableType();
}
