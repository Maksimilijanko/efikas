package org.unibl.etf.efikas.services;

import org.springframework.stereotype.Service;
import org.unibl.etf.efikas.repositories.ExpensesBookRepository;

@Service
public class ExpensesBookService {
    private final ExpensesBookRepository expensesBookRepository;

    public ExpensesBookService(ExpensesBookRepository expensesBookRepository) {
        this.expensesBookRepository = expensesBookRepository;
    }
}
