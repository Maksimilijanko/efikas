package org.unibl.etf.efikas.design_patterns.strategy;

import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.stereotype.Component;
import org.unibl.etf.efikas.models.dto.itextpdf.SpecialRow;
import org.unibl.etf.efikas.models.dto.itextpdf.TableConfig;
import org.unibl.etf.efikas.models.dto.itextpdf.TableData;
import org.unibl.etf.efikas.models.enums.RowType;
import org.unibl.etf.efikas.models.enums.TableType;

import java.util.List;

@Component
public class IncomeTableStrategy implements TableStrategy {

    @Override
    public Table createTable(TableData tableData) {
        TableConfig config = tableData.getConfig();
        Table table = new Table(UnitValue.createPercentArray(config.getColumnWidths()));
        table.setWidth(UnitValue.createPercentValue(100));

        // Add title if needed
        if (config.isHasTitleRow() && config.getTitle() != null) {
            int colSpan = config.getColumnWidths().length;
            Cell titleCell = createCell(config.getTitle(), colSpan, 1)
                    .setTextAlignment(TextAlignment.CENTER)
                    .simulateBold()
                    .setBackgroundColor(ColorConstants.LIGHT_GRAY);
            table.addHeaderCell(titleCell);
        }

        // Add headers
        tableData.getHeaders().forEach(header ->
                table.addHeaderCell(createHeaderCell(header)));

        // Add special rows (like "Донесено стање")
        if (config.getSpecialRows() != null) {
            config.getSpecialRows().stream()
                    .filter(row -> row.getType() == RowType.START_BALANCE)
                    .forEach(row -> addSpecialRow(table, row, config.getColumnWidths().length));
        }

        // Add data rows
        tableData.getRows().forEach(rowData ->
                addDataRow(table, rowData, config.getColumnWidths().length));

        // Add total row if needed
        if (config.isHasTotalRow()) {
            config.getSpecialRows().stream()
                    .filter(row -> row.getType() == RowType.TOTAL)
                    .forEach(row -> addTotalRow(table, row, config.getColumnWidths().length));
        }


        // jebo me svekar sta ovog ima...
        return table;
    }

    @Override
    public TableType getTableType() {
        return TableType.FINANCIAL;
    }

    private void addSpecialRow(Table table, SpecialRow row, int totalColumns) {
        Cell labelCell = createCell(row.getLabel(), row.getEndColumn() - row.getStartColumn() + 1, 1)
                .setTextAlignment(TextAlignment.LEFT);
        table.addCell(labelCell);

        // Fill remaining cells
        for (int i = row.getEndColumn() + 1; i < totalColumns; i++) {
            table.addCell(createEmptyCell());
        }
    }

    private void addDataRow(Table table, List<String> rowData, int totalColumns) {
        for (int i = 0; i < totalColumns; i++) {
            String value = i < rowData.size() ? rowData.get(i) : "";
            TextAlignment alignment = (i >= 3 && i < 7) ? TextAlignment.RIGHT : TextAlignment.CENTER;
            table.addCell(createCell(value, 1, 1).setTextAlignment(alignment));
        }
    }

    private void addTotalRow(Table table, SpecialRow row, int totalColumns) {
        Cell totalCell = createCell(row.getLabel(), row.getEndColumn() - row.getStartColumn() + 1, 1)
                .setTextAlignment(TextAlignment.LEFT)
                .simulateBold();
        table.addCell(totalCell);

        for (int i = row.getEndColumn() + 1; i < totalColumns; i++) {
            table.addCell(createEmptyCell().simulateBold());
        }
    }

    private Cell createCell(String content, int colSpan, int rowSpan) {
        return new Cell(rowSpan, colSpan).add(new Paragraph(content));
    }

    private Cell createHeaderCell(String text) {
        return createCell(text, 1, 1)
                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                .setTextAlignment(TextAlignment.CENTER);
    }

    private Cell createEmptyCell() {
        return createCell("", 1, 1);
    }
}
