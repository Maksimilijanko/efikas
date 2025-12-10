package org.unibl.etf.efikas.services;

import org.springframework.stereotype.Service;
import org.unibl.etf.efikas.repositories.IncomeBookRepository;

@Service
public class IncomeBookService {
    private final IncomeBookRepository incomeBookRepository;

    public IncomeBookService(IncomeBookRepository incomeBookRepository) {
        this.incomeBookRepository = incomeBookRepository;
    }

    
}
