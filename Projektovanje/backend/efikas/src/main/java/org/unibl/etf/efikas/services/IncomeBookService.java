package org.unibl.etf.efikas.services;

import org.modelmapper.ModelMapper;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.unibl.etf.efikas.models.dto.books.IncomeBookDTO;
import org.unibl.etf.efikas.models.dto.books.IncomeEntry;
import org.unibl.etf.efikas.models.entities.IncomeBook;
import org.unibl.etf.efikas.models.requests.FinancialBookRequest;
import org.unibl.etf.efikas.repositories.IncomeBookRepository;

import java.time.LocalDate;
import java.util.List;

@Service
public class IncomeBookService {
    private final IncomeBookRepository incomeBookRepository;
    private final ModelMapper modelMapper;

    public IncomeBookService(IncomeBookRepository incomeBookRepository, ModelMapper modelMapper) {
        this.incomeBookRepository = incomeBookRepository;
        this.modelMapper = modelMapper;
    }

    public List<IncomeEntry> getAll() {
        return incomeBookRepository.findAll().stream()
                .map(ib -> modelMapper.map(ib, IncomeEntry.class))
                .toList();
    }

    @PreAuthorize("@userSecurity.isApartmentOwner(authentication, #apartmentId)")
    public IncomeEntry createNewIncome(IncomeEntry incomeEntry) {
        IncomeBook incomeBook = modelMapper.map(incomeEntry, IncomeBook.class);
        IncomeBook saved = incomeBookRepository.save(incomeBook);

        return modelMapper.map(saved, IncomeEntry.class);
    }

    public IncomeBookDTO getIncomeBookByTime(FinancialBookRequest financialBookRequest) {
        LocalDate from = financialBookRequest.getFrom(), to = financialBookRequest.getTo();
        List<IncomeEntry> entries = getAll().stream()
                .filter(e -> {

                    LocalDate date = e.getAccountingDate();
                    return (date.isEqual(from) || date.isAfter(from)) &&
                            (date.isEqual(to) || date.isBefore(to));
                })
                .toList();

        IncomeEntry broughtState = getBroughtState(to);

        return IncomeBookDTO.builder()
                .entries(entries)
                .build();
    }

    public IncomeEntry getBroughtState(LocalDate previousDay) {
        LocalDate firstDayInYear = LocalDate.of(LocalDate.now().getYear(), 1, 1);
        // TODO:
        return IncomeEntry.builder().build();
    }
}
