package org.unibl.etf.efikas.services;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.unibl.etf.efikas.models.dto.books.IncomeBookDTO;
import org.unibl.etf.efikas.models.dto.books.IncomeEntry;
import org.unibl.etf.efikas.models.entities.IncomeBook;
import org.unibl.etf.efikas.models.requests.CreateIncomeBookRequest;
import org.unibl.etf.efikas.models.requests.FinancialBookPdfRequest;
import org.unibl.etf.efikas.repositories.IncomeBookRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IncomeBookService {
    private final IncomeBookRepository incomeBookRepository;
    private final ApartmentService apartmentService;
    private final ModelMapper modelMapper;


    public List<IncomeEntry> getAll() {
        return incomeBookRepository.findAll().stream()
                .map(ib -> modelMapper.map(ib, IncomeEntry.class))
                .toList();
    }


    public IncomeEntry createNewIncome(CreateIncomeBookRequest createIncomeBookRequest) {
        IncomeEntry incomeEntry = createIncomeBookRequest.toIncomeEntry();
        incomeEntry.setApartment(apartmentService.getApartmentById(createIncomeBookRequest.getApartmentId()));

        IncomeBook incomeBook = modelMapper.map(incomeEntry, IncomeBook.class);
        incomeBook.setId(null);
        IncomeBook saved = incomeBookRepository.save(incomeBook);

        return modelMapper.map(saved, IncomeEntry.class);
    }

    public IncomeBookDTO getIncomeBookByTime(FinancialBookPdfRequest financialBookPdfRequest) {
        LocalDate from = financialBookPdfRequest.getFrom() != null ? financialBookPdfRequest.getFrom() : firstDateInYear(),
                to = financialBookPdfRequest.getTo();
        List<IncomeEntry> entries = getAll().stream()
                .filter(e -> {
                    LocalDate date = e.getAccountingDate();
                    return (date.isEqual(from) || date.isAfter(from)) &&
                            (date.isEqual(to) || date.isBefore(to));
                })
                .collect(Collectors.toList());

        IncomeEntry broughtState = getBroughtState(from);

        return IncomeBookDTO.builder()
                .taxpayer(financialBookPdfRequest.getTaxpayer())
                .store(financialBookPdfRequest.getStore())
                .entries(entries)
                .broughtState(broughtState)
                .build();
    }


    public IncomeEntry getBroughtState(LocalDate from) {
        // TODO:
        return IncomeEntry.builder().build();
    }

    private LocalDate firstDateInYear() {
        return LocalDate.of(LocalDate.now().getYear(), 1, 1);
    }
}
