package org.unibl.etf.efikas.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.unibl.etf.efikas.models.CashRegister;

@Repository
public interface CashRegisterRepository extends JpaRepository<CashRegister, Long> {
    CashRegister findCashRegisterByCashRegisterId(Long cashRegisterId);
}