package org.unibl.etf.efikas.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.unibl.etf.efikas.models.entities.ApartmentExpense;

@Repository
public interface ApartmentExpenseRepository extends JpaRepository<ApartmentExpense, Long> {
}
