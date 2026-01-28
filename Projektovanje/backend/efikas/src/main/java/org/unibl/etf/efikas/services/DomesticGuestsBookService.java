package org.unibl.etf.efikas.services;

import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.unibl.etf.efikas.models.dto.DateRangeDTO;
import org.unibl.etf.efikas.models.dto.DomesticGuestDTO;
import org.unibl.etf.efikas.models.dto.books.DomesticGuestsBookDTO;
import org.unibl.etf.efikas.models.dto.books.entries.DomesticGuestsEntry;
import org.unibl.etf.efikas.models.entities.AppUser;
import org.unibl.etf.efikas.models.entities.GuestsBook;
import org.unibl.etf.efikas.models.requests.CreateDomesticGuestRequest;
import org.unibl.etf.efikas.repositories.GuestsBookRepository;
import org.unibl.etf.efikas.repositories.specifications.DomesticGuestsPdfSpecifications;

import java.time.LocalDate;
import java.util.List;

@Service
@AllArgsConstructor
public class DomesticGuestsBookService {
    private final GuestsBookRepository domesticGuestsBookRepository;
    private final ApartmentService apartmentService;
    private final AppUserService appUserService;
    private final ModelMapper modelMapper;

    public List<DomesticGuestsEntry> getAll() {
        return domesticGuestsBookRepository.findAll().stream()
                .map(ib -> modelMapper.map(ib, DomesticGuestsEntry.class))
                .toList();
    }

    /**
     * Persists a new domestic guest entry to the database.
     * */
    @Transactional
    public DomesticGuestsEntry createNewDomesticGuest(DomesticGuestDTO createDomesticGuestRequest) {
        if (domesticGuestsBookRepository.existsByPhoneNumber(createDomesticGuestRequest.getPhoneNumber())) {
            throw new DataIntegrityViolationException("Phone number already exists");
        }

        GuestsBook domesticGuestsBook = modelMapper.map(createDomesticGuestRequest, GuestsBook.class);
        domesticGuestsBook.setId(null);

        //System.out.println("domesticGuestsBook: " + domesticGuestsBook);

        GuestsBook saved = domesticGuestsBookRepository.save(domesticGuestsBook);

        return modelMapper.map(saved, DomesticGuestsEntry.class);
    }

    /**
     * Updates a domestic guest
     * */
    @Transactional
    public DomesticGuestsEntry updateDomesticGuest(int guestId, DomesticGuestDTO updateDomesticGuestRequest) {
        updateDomesticGuestRequest.setId(guestId);
        GuestsBook domesticGuestsBook = modelMapper.map(updateDomesticGuestRequest, GuestsBook.class);

        GuestsBook saved = domesticGuestsBookRepository.save(domesticGuestsBook);

        return modelMapper.map(saved, DomesticGuestsEntry.class);
    }


    public DomesticGuestsBookDTO findForPdf(
            LocalDate fromDate,
            LocalDate toDate,
            Boolean active
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        AppUser user = appUserService.getUserByEmail(email);
        System.out.println("USER ID: " + user.getUserId() + " | EMAIL: " + email);

        validateFilters(fromDate, toDate, active);
        DateRangeDTO period = DateRangeDTO.builder()
                .from(fromDate)
                .to(toDate)
                .build();

        Specification<GuestsBook> spec = DomesticGuestsPdfSpecifications.belongsToUser(user.getUserId())
                .and(DomesticGuestsPdfSpecifications.isLocal()) // Filter at DB level!
                .and(DomesticGuestsPdfSpecifications.dateOfArrival(fromDate))
                .and(DomesticGuestsPdfSpecifications.dateOfDeparture(toDate));

        List<DomesticGuestsEntry> entries = domesticGuestsBookRepository.findAll(spec).stream()
                .map(fgb -> modelMapper.map(fgb, DomesticGuestsEntry.class))
                .toList();

        System.out.println("ENTRIES FROM METHOD: " + entries);

        return DomesticGuestsBookDTO.builder()
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
