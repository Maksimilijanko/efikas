package org.unibl.etf.efikas.controllers;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;
import org.unibl.etf.efikas.exceptions.BookPdfGenerationException;
import org.unibl.etf.efikas.design_patterns.factory.BookPdfFactory;
import org.unibl.etf.efikas.models.dto.books.IncomeBookDTO;
import org.unibl.etf.efikas.models.dto.books.IncomeEntry;
import org.unibl.etf.efikas.models.enums.BookType;
import org.unibl.etf.efikas.models.requests.BookRequest;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/books")
public class BooksController {

    private final BookPdfFactory bookPdfFactory;

    public BooksController(BookPdfFactory bookPdfFactory) {
        this.bookPdfFactory = bookPdfFactory;
    }

    @GetMapping("/{type}")
    public ResponseEntity<StreamingResponseBody> downloadBookPdf(@PathVariable BookType type) { //, BookRequest request
        var service = bookPdfFactory.get(type);

        InputStream pdfStream;
        try {
            // TODO: Generisati ovdje DTO klasu dinamički sa podacima koja implementira BookRequest (u zavisnosti od tipa)
            //  pa je slati servisu, ili u servisu generisati (bez argumenta request u metodi generatePdf interfejsa)?

            IncomeBookDTO request = IncomeBookDTO.builder()
                    .taxpayerName("Марко Марковић")
                    .taxpayerJmbg("0123456789123")
                    .taxpayerAddress("Улица краља Петра I бр. 12, Бања Лука")
                    .storeName("Марко ДОО")
                    .storeAddress("Трг Крајине 1, Бања Лука")
                    .activity("Трговина на мало")
                    .activityCode("4711")
                    .jib("1234567890123")
                    .build();

            List<IncomeEntry> entries = new ArrayList<>();
            entries.add(IncomeEntry.builder()
                            .ordinalNumber(1)
                            .accountingDate(LocalDate.now())
                            .description("Opis")
                            .salesIncome(new BigDecimal("20.00"))
                            .otherIncome(new BigDecimal("10.00"))
                            .financialIncome(new BigDecimal("50.00"))
                            .totalIncome(new BigDecimal("80.00"))
                            .calculatedVat(new BigDecimal("66.40")) // ukupno - 17% PDV?
                    .build()
            );

            request.setEntries(entries);


            pdfStream = service.generatePdf(request);
        } catch (IOException e) {
            throw new BookPdfGenerationException(e.getMessage());
        }

        StreamingResponseBody responseBody = pdfStream::transferTo;

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + type + "_" + System.currentTimeMillis() + ".pdf\"")
                .body(responseBody);
    }
}
