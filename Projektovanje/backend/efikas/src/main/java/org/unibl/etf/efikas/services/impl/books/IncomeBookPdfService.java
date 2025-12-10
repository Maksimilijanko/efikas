package org.unibl.etf.efikas.services.impl.books;

import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import org.springframework.stereotype.Service;
import org.unibl.etf.efikas.design_patterns.factory.BookTableFactory;
import org.unibl.etf.efikas.models.dto.books.IncomeBookDTO;
import org.unibl.etf.efikas.models.dto.books.IncomeEntry;
import org.unibl.etf.efikas.models.dto.itextpdf.TableConfig;
import org.unibl.etf.efikas.models.dto.itextpdf.TableData;
import org.unibl.etf.efikas.models.enums.BookType;
import org.unibl.etf.efikas.models.enums.TableType;
import org.unibl.etf.efikas.handlers.BookTypeHandler;
import org.unibl.etf.efikas.services.IncomeBookService;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

/**
 * Service for generating the PDF for income books.
 * */
@Service
public class IncomeBookPdfService extends BaseBookPdfService<IncomeBookDTO> implements BookTypeHandler {

    private final BookTableFactory bookTableFactory;
    private final IncomeBookService incomeBookService;

    public IncomeBookPdfService(BookTableFactory bookTableFactory, IncomeBookService incomeBookService) {
        this.bookTableFactory = bookTableFactory;
        this.incomeBookService = incomeBookService;
    }


    @Override
    public InputStream generatePdf(IncomeBookDTO request) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try (PdfWriter writer = new PdfWriter(baos); Document document = createDocument(writer)) {
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


    @Override
    public BookType getSupportedType() {
        return BookType.INCOME;
    }

    private Table getIncomeTable(IncomeBookDTO request) {
//        SpecialRow startBalance = SpecialRow.builder()
//                .label("Донесено стање")
//                .type(RowType.START_BALANCE)
//                .startColumn(2) // Starts at column 3 (0-based index)
//                .endColumn(2)
//                .build();
//
//        SpecialRow totalRow = SpecialRow.builder()
//                .label("Укупно за пренос")
//                .type(RowType.TOTAL)
//                .startColumn(2) // Starts at column 3
//                .endColumn(2)
//                .build();
//
//        List<SpecialRow> specialRows = new ArrayList<>();
//        specialRows.add(startBalance);
//        specialRows.add(totalRow);

        TableData receiptData = TableData.builder()
                .title("КЊИГА ПРИХОДА")
                .headers(List.of(
                        "Ред. бр.",
                        "Датум књижења",
                        "Опис промјене (назив, број и датум документа за књижење)",
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
                                //.specialRows(specialRows)
                                .build()
                )
                .rows(getIncomeData(request))
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
                                .columnWidths(new float[]{4, 6}) // 40% : 60%
                                .hasTitleRow(true)
                                .build()
                )
                .build();

        // Use data from request
        infoData.getRows().add(List.of("ИМЕ И ПРЕЗИМЕ", request.getTaxpayerName()));
        infoData.getRows().add(List.of("ЈЕДИНСТВЕНИ МАТИЧНИ БРОЈ ГРАЂАНИНА", request.getTaxpayerJmbg()));
        infoData.getRows().add(List.of("АДРЕСА СТАНОВАЊА", request.getTaxpayerAddress()));

        return bookTableFactory.createTable(TableType.INFO, infoData);
    }

    private Table getStoreTable(IncomeBookDTO request) {
        TableData infoData = TableData.builder()
                .title("ОСНОВНИ ПОДАЦИ О РАДЊИ")
                .rows(new ArrayList<>())
                .config(
                        TableConfig.builder()
                                .columnWidths(new float[]{4, 6}) // 40% : 60%
                                .hasTitleRow(true)
                                .build()
                )
                .build();

        infoData.getRows().add(List.of("НАЗИВ", request.getStoreName()));
        infoData.getRows().add(List.of("АДРЕСА", request.getStoreAddress()));
        infoData.getRows().add(List.of("ДЈЕЛАТНОСТ", request.getActivity()));
        infoData.getRows().add(List.of("ШИФРА ДЈЕЛАТНОСТИ", request.getActivityCode()));
        infoData.getRows().add(List.of("ЈИБ", request.getJib()));

        return bookTableFactory.createTable(TableType.INFO, infoData);
    }

    private String formatAmount(BigDecimal amount) {
        if (amount == null) return "";
        return String.format("%.2f", amount);
    }
}
