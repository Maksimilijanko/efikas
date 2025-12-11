package org.unibl.etf.efikas.services;

import org.modelmapper.ModelMapper;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.unibl.etf.efikas.models.dto.books.IncomeEntry;
import org.unibl.etf.efikas.models.entities.IncomeBook;
import org.unibl.etf.efikas.repositories.IncomeBookRepository;

@Service
public class IncomeBookService {
    private final IncomeBookRepository incomeBookRepository;
    private final ModelMapper modelMapper;

    public IncomeBookService(IncomeBookRepository incomeBookRepository, ModelMapper modelMapper) {
        this.incomeBookRepository = incomeBookRepository;
        this.modelMapper = modelMapper;
    }

    @PreAuthorize("@userSecurity.isApartmentOwner(authentication, #apartmentId)")
    public Integer createNewIncome(IncomeEntry incomeEntry, Authentication authentication) {
        IncomeBook incomeBook = modelMapper.map(incomeEntry, IncomeBook.class);
        incomeBookRepository.save(incomeBook);

        return 0;
    }
}
