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

    @GetMapping("/pdf/{type}")
    public ResponseEntity<StreamingResponseBody> downloadBookPdf(@PathVariable BookType type) { //, @RequestBody FinancialBookPdfRequest financialBookPdfRequest
        FinancialBookPdfRequest financialBookPdfRequest = null;

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
            IncomeBookDTO request = IncomeBookDTO.builder() // TODO: BooksController - pdf trenutno samo za knjigu prihoda
                    .taxpayer(taxpayer)
                    .store(store)
                    .build();

//            IncomeEntry broughtState = incomeBookService.getBroughtState(financialBookPdfRequest.getFrom());
//            if(broughtState != null) request.setBroughtState(broughtState);

            List<IncomeEntry> entries = new ArrayList<>();
            for(int i = 1; i <= 20; i++){
                entries.add(IncomeEntry.builder()
                        .id(i)
                        .apartment(new ApartmentResponse())
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

            // TODO: IncomeBookDTO request = incomeBookService.getIncomeBookByTime(financialBookPdfRequest);

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
}
