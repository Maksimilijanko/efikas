package org.unibl.etf.efikas.services;

import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.unibl.etf.efikas.models.dto.books.entries.ForeignGuestsEntry;
import org.unibl.etf.efikas.models.entities.ForeignGuestsBook;
import org.unibl.etf.efikas.models.requests.CreateForeignGuestRequest;
import org.unibl.etf.efikas.repositories.ForeignGuestsBookRepository;
import org.unibl.etf.efikas.repositories.specifications.ForeignGuestsPdfSpecifications;

import java.time.LocalDate;
import java.util.List;

@Service
@AllArgsConstructor
public class ForeignGuestsBookService {
    private final ForeignGuestsBookRepository foreignGuestsBookRepository;
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

        ForeignGuestsBook foreignGuestsBook = modelMapper.map(foreignGuestsEntry, ForeignGuestsBook.class);
        foreignGuestsBook.setId(null);
        ForeignGuestsBook saved = foreignGuestsBookRepository.save(foreignGuestsBook);

        return modelMapper.map(saved, ForeignGuestsEntry.class);
    }


    public List<ForeignGuestsEntry> findForPdf(
            Integer apartmentId,
            LocalDate fromDate,
            LocalDate toDate,
            Boolean active
    ) {
        validateFilters(fromDate, toDate, active);

        Specification<ForeignGuestsBook> spec =
                ForeignGuestsPdfSpecifications.forApartment(apartmentId)
                        .and(ForeignGuestsPdfSpecifications.entryDateFrom(fromDate))
                        .and(ForeignGuestsPdfSpecifications.entryDateTo(toDate))
                        .and(ForeignGuestsPdfSpecifications.active(active))
                        .and(ForeignGuestsPdfSpecifications.orderForPdf());

        return foreignGuestsBookRepository.findAll(spec).stream()
                .map(fgb -> modelMapper.map(fgb, ForeignGuestsEntry.class))
                .toList();
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
