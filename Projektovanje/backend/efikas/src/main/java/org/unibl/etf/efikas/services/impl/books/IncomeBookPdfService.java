package org.unibl.etf.efikas.services.impl.books;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import org.springframework.stereotype.Service;
import org.unibl.etf.efikas.design_patterns.factory.BookTableFactory;
import org.unibl.etf.efikas.models.dto.books.IncomeBookDTO;
import org.unibl.etf.efikas.models.dto.books.IncomeEntry;
import org.unibl.etf.efikas.models.dto.itextpdf.SpecialRow;
import org.unibl.etf.efikas.models.dto.itextpdf.TableConfig;
import org.unibl.etf.efikas.models.dto.itextpdf.TableData;
import org.unibl.etf.efikas.models.enums.BookType;
import org.unibl.etf.efikas.models.enums.RowType;
import org.unibl.etf.efikas.models.enums.TableType;
import org.unibl.etf.efikas.services.interfaces.BookPdfService;
import org.unibl.etf.efikas.services.interfaces.BookTypeHandler;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import static com.itextpdf.kernel.pdf.PdfName.BaseFont;

@Service
public class IncomeBookPdfService implements BookPdfService<IncomeBookDTO>, BookTypeHandler {

    private final BookTableFactory bookTableFactory;

    public IncomeBookPdfService(BookTableFactory bookTableFactory) {
        this.bookTableFactory = bookTableFactory;
    }


    @Override
    public InputStream generatePdf(IncomeBookDTO request) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try (PdfWriter writer = new PdfWriter(baos);
             PdfDocument pdfDocument = new PdfDocument(writer);
             Document document = new Document(pdfDocument)) {

            document.setMargins(20, 20, 20, 20);

            // Add header with date
            addHeader(document, request);

            // Add taxpayer info table
            document.add(getTaxpayerTable(request));
            document.add(new Paragraph("\n"));

            // Add store info table
            document.add(getStoreTable(request));
            document.add(new Paragraph("\n"));

            // Add income table
            document.add(getIncomeTable(request));

        } catch (Exception e) {
            e.printStackTrace();
            throw new IOException("Failed to generate Income PDF", e);
        }

        return new ByteArrayInputStream(baos.toByteArray());
    }

    private void addHeader(Document document, IncomeBookDTO request) {
        Paragraph header = new Paragraph("eFIKAS KNJIGA PRIHODA")
                .setTextAlignment(TextAlignment.CENTER)
                .simulateBold()
                .setFontSize(12);
        document.add(header);

        Paragraph date = new Paragraph("1.12.2025.")
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(10);
        document.add(date);

        document.add(new Paragraph("\n"));
    }

    @Override
    public BookType getSupportedType() {
        return BookType.INCOME;
    }

    private Table getIncomeTable(IncomeBookDTO request) {
        SpecialRow startBalance = SpecialRow.builder()
                .label("Донесено стање")
                .type(RowType.START_BALANCE)
                .startColumn(0)
                .endColumn(2)
                .build();

        SpecialRow totalRow = SpecialRow.builder()
                .label("Укупно за пренос")
                .type(RowType.TOTAL)
                .startColumn(0)
                .endColumn(2)
                .build();

        List<SpecialRow> specialRows = new ArrayList<>();
        specialRows.add(startBalance);
        specialRows.add(totalRow);

        TableData receiptData = TableData.builder()
                .title("КЊИГА ПРИХОДА")
                .headers(List.of(
                        "Ред. бр.", "Датум књижења", "Опис промјене",
                        "Наплаћени приходи од продаје производа",
                        "Наплаћени остали приходи",
                        "Наплаћени финансијски приходи",
                        "Укупно наплаћени приходи",
                        "Обрачунати ПДВ"
                ))
                .config(
                        TableConfig.builder()
                                .columnWidths(new float[]{0.5f, 1.5f, 3f, 1.5f, 1.5f, 1.5f, 1.5f, 1.5f})
                                .hasTitleRow(true)
                                .hasTotalRow(true)
                                .specialRows(specialRows)
                                .build()
                )
                .rows(getIncomeData(request)) // Get actual data from request
                .build();

        return bookTableFactory.createTable(TableType.FINANCIAL, receiptData);
    }

    private List<List<String>> getIncomeData(IncomeBookDTO request) {
        // Convert your request data to table rows
        List<List<String>> rows = new ArrayList<>();

        for (IncomeEntry entry : request.getEntries()) {
            List<String> row = new ArrayList<>();
            row.add(String.valueOf(entry.getOrdinalNumber()));
            row.add(entry.getAccountingDate().format(DateTimeFormatter.ofPattern("dd.MM.yyyy")));
            row.add(entry.getDescription());
            row.add(formatAmount(entry.getSalesIncome()));
            row.add(formatAmount(entry.getOtherIncome()));
            row.add(formatAmount(entry.getFinancialIncome()));
            row.add(formatAmount(entry.getTotalIncome()));
            row.add(formatAmount(entry.getCalculatedVat()));
            rows.add(row);
        }

        return rows;
    }

    private Table getTaxpayerTable(IncomeBookDTO request) {
        TableData infoData = TableData.builder()
                .title("ОСНОВНИ ПОДАЦИ О ПОРЕСКОМ ОБВЕЗНИКУ")
                .rows(new ArrayList<>())
                .config(
                        TableConfig.builder()
                                .columnWidths(new float[]{1})
                                .hasTitleRow(true)
                                .build()
                )
                .build();

        // Use data from request
        infoData.getRows().add(List.of("Ime i Prezime: ", request.getTaxpayerName()));
        infoData.getRows().add(List.of("ЈЕДИНСТВЕНИ МАТИЧНИ БРОЈ ГРАЂАНИНА: " + request.getTaxpayerJmbg()));
        infoData.getRows().add(List.of("АДРЕСА СТАНОВАЊА: " + request.getTaxpayerAddress()));

        return bookTableFactory.createTable(TableType.INFO, infoData);
    }

    private Table getStoreTable(IncomeBookDTO request) {
        TableData infoData = TableData.builder()
                .title("ОСНОВНИ ПОДАЦИ О РАДЊИ")
                .rows(new ArrayList<>())
                .config(
                        TableConfig.builder()
                                .columnWidths(new float[]{1})
                                .hasTitleRow(true)
                                .build()
                )
                .build();

        infoData.getRows().add(List.of("НАЗИВ: " + request.getStoreName()));
        infoData.getRows().add(List.of("АДРЕСА: " + request.getStoreAddress()));
        infoData.getRows().add(List.of("ДЈЕЛАТНОСТ: " + request.getActivity()));
        infoData.getRows().add(List.of("ШИФРА ДЈЕЛАТНОСТИ: " + request.getActivityCode()));
        infoData.getRows().add(List.of("ЈИБ: " + request.getJib()));

        return bookTableFactory.createTable(TableType.INFO, infoData);
    }

    private String formatAmount(BigDecimal amount) {
        if (amount == null) return "";
        return String.format("%.2f", amount);
    }
}
