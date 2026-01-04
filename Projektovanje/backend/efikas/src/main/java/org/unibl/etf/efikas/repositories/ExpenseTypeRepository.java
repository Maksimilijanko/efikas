package org.unibl.etf.efikas.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.unibl.etf.efikas.models.entities.ExpenseType;

import java.util.Optional;

public interface ExpenseTypeRepository extends JpaRepository<ExpenseType, Integer> {
    Optional<ExpenseType> findByName(String expenseTypeName);
}
