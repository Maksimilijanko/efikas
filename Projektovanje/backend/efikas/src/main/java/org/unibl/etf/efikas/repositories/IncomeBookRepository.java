package org.unibl.etf.efikas.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.unibl.etf.efikas.models.entities.IncomeBook;

public interface IncomeBookRepository extends JpaRepository<IncomeBook, Integer> {
}
