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
import org.unibl.etf.efikas.models.dto.ApartmentDTO;
import org.unibl.etf.efikas.models.dto.books.IncomeBookDTO;
import org.unibl.etf.efikas.models.dto.books.IncomeEntry;
import org.unibl.etf.efikas.models.dto.books.StoreDTO;
import org.unibl.etf.efikas.models.dto.books.TaxpayerDTO;
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
        var pdfService = bookPdfFactory.get(type);

        InputStream pdfStream;
        try {
            // TODO: Generisati ovdje DTO klasu dinamički sa podacima koja implementira BookRequest (u zavisnosti od tipa)
            //  pa je slati servisu, ili u servisu generisati (bez argumenta request u metodi generatePdf interfejsa)?

            TaxpayerDTO taxpayer = TaxpayerDTO.builder()
                    .fullName("Марко Марковић")
                    .jmbg("0123456789123")
                    .address("Улица краља Петра I бр. 12, Бања Лука")
                    .build();
            StoreDTO store = StoreDTO.builder()
                    .name("Марко ДОО")
                    .address("Трг Крајине 1, Бања Лука")
                    .activity("Трговина на мало")
                    .activityCode("4711")
                    .jib("1234567890123")
                    .build();
            IncomeBookDTO request = IncomeBookDTO.builder()
                    .taxpayer(taxpayer)
                    .store(store)
                    .build();

            List<IncomeEntry> entries = new ArrayList<>();
            for(int i = 1; i <= 20; i++){
                entries.add(IncomeEntry.builder()
                        .id(i)
                        .apartment(new ApartmentDTO())
                        .accountingDate(LocalDate.now())
                        .description("Opis asdhajhdskahfkjdlsahfjkahsjkfhkjl")
                        .productSaleRevenue(new BigDecimal("0"))
                        .goodsSaleRevenue(new BigDecimal("10.00"))
                        .serviceSaleRevenue(new BigDecimal("100.00"))
                        .otherRevenue(new BigDecimal("10.00"))
                        .financialRevenue(new BigDecimal("50.00"))
                        .totalRevenue(new BigDecimal("170.00"))
                        .vatAmount(new BigDecimal("28.90")) // 17% PDV od ukupno?
                        .build()
                );
            }
            request.setEntries(entries);

            pdfStream = pdfService.generatePdf(request);
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
