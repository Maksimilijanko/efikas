package org.unibl.etf.efikas.controllers;

import lombok.AllArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
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
import org.unibl.etf.efikas.models.dto.books.*;
import org.unibl.etf.efikas.models.dto.books.entries.DomesticGuestsEntry;
import org.unibl.etf.efikas.models.dto.books.entries.ForeignGuestsEntry;
import org.unibl.etf.efikas.models.dto.books.entries.IncomeEntry;
import org.unibl.etf.efikas.models.enums.BookType;
import org.unibl.etf.efikas.models.requests.*;
import org.unibl.etf.efikas.services.DomesticGuestsBookService;
import org.unibl.etf.efikas.services.ForeignGuestsBookService;
import org.unibl.etf.efikas.services.IncomeBookService;
import org.unibl.etf.efikas.services.impl.books.BaseBookPdfService;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/books")
@AllArgsConstructor
public class BooksController {
    private final BookPdfFactory bookPdfFactory;
    private final IncomeBookService incomeBookService;
    private final ForeignGuestsBookService foreignGuestsBookService;
    private final DomesticGuestsBookService domesticGuestsBookService;


    // =========================================== PDF endpoints ===========================================

    @GetMapping("/pdf/INCOME")
    public ResponseEntity<StreamingResponseBody> downloadBookPdf(@RequestBody DateRangeDTO dateRangeDTO) throws IOException { //, @RequestBody FinancialBookPdfRequest financialBookPdfRequest
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

        var pdfService = bookPdfFactory.get(BookType.INCOME);
        IncomeBookDTO request = incomeBookService.getIncomeBookByTime(financialBookPdfRequest);

        return getStreamingResponseBodyResponseEntity(pdfService, request, BookType.INCOME);
    }

    @GetMapping("/pdf/FOREIGN_GUESTS")
    public ResponseEntity<StreamingResponseBody> downloadForeignGuestsBookPdf() throws IOException { //@RequestBody GuestsBookRequest guestsBookRequest
        // Currently for easier testing
        GuestsBookRequest guestsBookRequest = GuestsBookRequest.builder()
                .apartmentId(2)
                .period(
                        DateRangeDTO.builder()
                                .from(LocalDate.of(2025, 12, 13))
                                .to(LocalDate.of(2025, 12, 20))
                                .build()
                )
                .build();


        LocalDate from = guestsBookRequest.getPeriod().getFrom(), to = guestsBookRequest.getPeriod().getTo();
        if(from.isAfter(to)) {
            throw new InvalidBookPeriodException("From date can not come after To date range");
        }

        var pdfService = bookPdfFactory.get(BookType.FOREIGN_GUESTS);
        ForeignGuestsBookDTO request = foreignGuestsBookService.findForPdf(guestsBookRequest.getApartmentId(), from, to, false);

        return getStreamingResponseBodyResponseEntity(pdfService, request, BookType.FOREIGN_GUESTS);
    }

    @GetMapping("/pdf/DOMESTIC_GUESTS")
    public ResponseEntity<StreamingResponseBody> downloadDomesticGuestsBookPdf() throws IOException {  //@RequestBody GuestsBookRequest guestsBookRequest
        // Currently for easier testing
        GuestsBookRequest guestsBookRequest = GuestsBookRequest.builder()
                .apartmentId(2)
                .period(
                        DateRangeDTO.builder()
                                .from(LocalDate.of(2025, 12, 14))
                                .to(LocalDate.of(2025, 12, 21))
                                .build()
                )
                .build();


        LocalDate from = guestsBookRequest.getPeriod().getFrom(), to = guestsBookRequest.getPeriod().getTo();
        if(from.isAfter(to)) {
            throw new InvalidBookPeriodException("From date can not come after To date range");
        }

        var pdfService = bookPdfFactory.get(BookType.DOMESTIC_GUESTS);
        DomesticGuestsBookDTO request = domesticGuestsBookService.findForPdf(guestsBookRequest.getApartmentId(), from, to, true);

        return getStreamingResponseBodyResponseEntity(pdfService, request, BookType.DOMESTIC_GUESTS);
    }



    // test endpoint
    @GetMapping("/foreign-guests/pdf-data")
    public ResponseEntity<?> getPdfData(
            @RequestParam Integer apartmentId,
            @RequestParam(required = false)
            LocalDate fromDate,
            @RequestParam(required = false)
            LocalDate toDate,
            @RequestParam(required = false) Boolean active
    ) {
        ForeignGuestsBookDTO result =
                foreignGuestsBookService.findForPdf(
                        apartmentId,
                        fromDate,
                        toDate,
                        active
                );

        return ResponseEntity.ok(result);
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
    public ResponseEntity<?> addDomesticGuestsEntry(@Validated @RequestBody CreateDomesticGuestRequest createDomesticGuestRequest) {
        DomesticGuestsEntry saved = domesticGuestsBookService.createNewDomesticGuest(createDomesticGuestRequest);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/{id}")
                .buildAndExpand(saved).toUri();

        return ResponseEntity.created(location).body(saved);
    }

    @PostMapping("/foreign-guests")
    public ResponseEntity<?> addForeignGuestsEntry(@Validated @RequestBody CreateForeignGuestRequest createForeignGuestRequest) {
        ForeignGuestsEntry saved = foreignGuestsBookService.createNewForeignGuest(createForeignGuestRequest);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/{id}")
                .buildAndExpand(saved.getId()).toUri();

        return ResponseEntity.created(location).body(saved);
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

    // =========================================== Private helpers ===========================================
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

    private ResponseEntity<StreamingResponseBody> getStreamingResponseBodyResponseEntity(
            BaseBookPdfService<BookRequest> pdfService,
            BookRequest request,
            BookType type
    ) {
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
}
