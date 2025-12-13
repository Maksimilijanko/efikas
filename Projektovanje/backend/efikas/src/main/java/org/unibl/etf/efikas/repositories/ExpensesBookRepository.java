package org.unibl.etf.efikas.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.unibl.etf.efikas.models.entities.ExpensesBook;

public interface ExpensesBookRepository extends JpaRepository<ExpensesBook, Integer> {
}
