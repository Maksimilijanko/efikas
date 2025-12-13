package org.unibl.etf.efikas.controllers;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.unibl.etf.efikas.exceptions.BookPdfGenerationException;
import org.unibl.etf.efikas.design_patterns.factory.BookPdfFactory;
import org.unibl.etf.efikas.exceptions.InvalidBookPeriodException;
import org.unibl.etf.efikas.models.dto.DateRangeDTO;
import org.unibl.etf.efikas.models.dto.books.IncomeBookDTO;
import org.unibl.etf.efikas.models.dto.books.IncomeEntry;
import org.unibl.etf.efikas.models.dto.books.StoreDTO;
import org.unibl.etf.efikas.models.dto.books.TaxpayerDTO;
import org.unibl.etf.efikas.models.enums.BookType;
import org.unibl.etf.efikas.models.requests.CreateIncomeBookRequest;
import org.unibl.etf.efikas.models.requests.FinancialBookPdfRequest;
import org.unibl.etf.efikas.models.responses.ApartmentResponse;
import org.unibl.etf.efikas.services.IncomeBookService;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.net.URI;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/books")
public class BooksController {

    private final BookPdfFactory bookPdfFactory;
    private final IncomeBookService incomeBookService;

    public BooksController(BookPdfFactory bookPdfFactory, IncomeBookService incomeBookService) {
        this.bookPdfFactory = bookPdfFactory;
        this.incomeBookService = incomeBookService;
    }

    // =========================================== PDF endpoints ===========================================

    @GetMapping("/pdf/{type}")
    public ResponseEntity<StreamingResponseBody> downloadBookPdf(@PathVariable BookType type, @RequestBody DateRangeDTO dateRangeDTO) { //, @RequestBody FinancialBookPdfRequest financialBookPdfRequest
        if(dateRangeDTO.getFrom().isAfter(dateRangeDTO.getTo())) {
            throw new InvalidBookPeriodException("From date can not come after To date range");
        }

        // TODO: needs to be fetched from database, have taxpayerId and storeId in request?
        TaxpayerDTO taxpayer = getTaxpayerDTO();
        StoreDTO store = getStoreDTO();
        FinancialBookPdfRequest financialBookPdfRequest = FinancialBookPdfRequest.builder()
                .taxpayer(taxpayer)
                .store(store)
                .period(dateRangeDTO)
                .build();

        var pdfService = bookPdfFactory.get(type);
        IncomeBookDTO request = incomeBookService.getIncomeBookByTime(financialBookPdfRequest);

        try (InputStream pdfStream = pdfService.generatePdf(request)) {  // try-with-resources without resource leaks
            StreamingResponseBody responseBody = outputStream -> {
                try {
                    pdfStream.transferTo(outputStream);
                } catch (IOException e) {
                    throw new BookPdfGenerationException("Failed to stream PDF content");
                }
            };

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + type + "_" + System.currentTimeMillis() + ".pdf\"")
                    .body(responseBody);
        } catch (IOException e) {
            throw new BookPdfGenerationException("Failed to generate PDF");
        }
    }

    // =========================================== POST endpoints ===========================================

    @PostMapping("/income")
    public ResponseEntity<?> addIncomeEntry(@Validated @RequestBody CreateIncomeBookRequest createIncomeBookRequest) {
        IncomeEntry saved = incomeBookService.createNewIncome(createIncomeBookRequest);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/{id}")
                .buildAndExpand(saved.getId()).toUri();

        return ResponseEntity.created(location).body(saved);
    }

    @PostMapping("/expenses")
    public ResponseEntity<?> addExpensesEntry(@RequestBody IncomeEntry incomeEntry) {


        return ResponseEntity.created(URI.create("test")).build();
    }

    @PostMapping("/domestic-guests")
    public ResponseEntity<?> addDomesticGuestsEntry(@RequestBody IncomeEntry incomeEntry) {


        return ResponseEntity.created(URI.create("test")).build();
    }

    @PostMapping("/foreign-guests")
    public ResponseEntity<?> addForeignGuestsEntry(@RequestBody IncomeEntry incomeEntry) {


        return ResponseEntity.created(URI.create("test")).build();
    }

    // =========================================== GET endpoints ===========================================
    // Test endpoint
    @GetMapping("/income")
    public ResponseEntity<?> getIncomeBookByTime() { // @RequestBody FinancialBookPdfRequest
        TaxpayerDTO taxpayer = getTaxpayerDTO();
        StoreDTO store = getStoreDTO();

        FinancialBookPdfRequest financialBookPdfRequest = FinancialBookPdfRequest.builder()
                .taxpayer(taxpayer)
                .store(store)
                .period(DateRangeDTO.builder()
                        .from(LocalDate.of(2025, 12, 13))
                        .to(LocalDate.of(2025, 12, 13))
                        .build()
                )
                .build();

        IncomeBookDTO dto = incomeBookService.getIncomeBookByTime(financialBookPdfRequest);

        return ResponseEntity.ok(dto);
    }

    private TaxpayerDTO getTaxpayerDTO() {
        return TaxpayerDTO.builder()
                .fullName("Марко Марковић")
                .jmbg("0123456789123")
                .address("Улица краља Петра I бр. 12, Бања Лука")
                .build();
    }

    private StoreDTO getStoreDTO() {
        return StoreDTO.builder()
                .name("Марко ДОО")
                .address("Трг Крајине 1, Бања Лука")
                .activity("Трговина на мало")
                .activityCode("4711")
                .jib("1234567890123")
                .build();
    }
}
