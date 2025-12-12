package org.unibl.etf.efikas.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.unibl.etf.efikas.repositories.ExpensesBookRepository;

@Service
@RequiredArgsConstructor
public class ExpensesBookService {
    private final ExpensesBookRepository expensesBookRepository;


}
