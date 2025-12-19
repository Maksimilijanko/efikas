package org.unibl.etf.efikas.services;

import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.unibl.etf.efikas.models.dto.DateRangeDTO;
import org.unibl.etf.efikas.models.dto.books.ForeignGuestsBookDTO;
import org.unibl.etf.efikas.models.dto.books.entries.ForeignGuestsEntry;
import org.unibl.etf.efikas.models.entities.GuestsBook;
import org.unibl.etf.efikas.models.requests.CreateForeignGuestRequest;
import org.unibl.etf.efikas.repositories.GuestsBookRepository;
import org.unibl.etf.efikas.repositories.specifications.ForeignGuestsPdfSpecifications;

import java.time.LocalDate;
import java.util.List;

@Service
@AllArgsConstructor
public class ForeignGuestsBookService {
    private final GuestsBookRepository foreignGuestsBookRepository;
    private final ApartmentService apartmentService;
    private final ModelMapper modelMapper;


    public List<ForeignGuestsEntry> getAll() {
        return foreignGuestsBookRepository.findAll().stream()
                .map(ib -> modelMapper.map(ib, ForeignGuestsEntry.class))
                .toList();
    }

    /**
     * Persists a new foreign guest entry to the database.
     * */
    public ForeignGuestsEntry createNewForeignGuest(CreateForeignGuestRequest createForeignGuestRequest) {
        ForeignGuestsEntry foreignGuestsEntry = modelMapper.map(createForeignGuestRequest, ForeignGuestsEntry.class);
        foreignGuestsEntry.setApartment(apartmentService.getApartmentById(createForeignGuestRequest.getApartmentId()));

        GuestsBook foreignGuestsBook = modelMapper.map(foreignGuestsEntry, GuestsBook.class);
        foreignGuestsBook.setId(null);
        GuestsBook saved = foreignGuestsBookRepository.save(foreignGuestsBook);

        return modelMapper.map(saved, ForeignGuestsEntry.class);
    }


    public ForeignGuestsBookDTO findForPdf(
            Integer apartmentId,
            LocalDate fromDate,
            LocalDate toDate,
            Boolean active
    ) {
        validateFilters(fromDate, toDate, active);
        DateRangeDTO period = DateRangeDTO.builder()
                .from(fromDate)
                .to(toDate)
                .build();

        Specification<GuestsBook> spec =
                ForeignGuestsPdfSpecifications.forApartment(apartmentId)
                        .and(ForeignGuestsPdfSpecifications.entryDateFrom(fromDate))
                        .and(ForeignGuestsPdfSpecifications.entryDateTo(toDate))
                        .and(ForeignGuestsPdfSpecifications.active(active))
                        .and(ForeignGuestsPdfSpecifications.orderForPdf());

        List<ForeignGuestsEntry> entries = foreignGuestsBookRepository.findAll(spec).stream()
                .map(fgb -> modelMapper.map(fgb, ForeignGuestsEntry.class))
                .toList();

        System.out.println("ENTRIES: " + entries);

        return ForeignGuestsBookDTO.builder()
                .period(period)
                .entries(entries)
                .build();
    }

    private void validateFilters(
            LocalDate fromDate,
            LocalDate toDate,
            Boolean active
    ) {
        if (fromDate == null && toDate == null && active == null) {
            throw new IllegalArgumentException(
                    "PDF export requires either date range or active flag"
            );
        }

        if (fromDate != null && toDate != null && fromDate.isAfter(toDate)) {
            throw new IllegalArgumentException(
                    "'fromDate' must be before or equal to 'toDate'"
            );
        }
    }
}
