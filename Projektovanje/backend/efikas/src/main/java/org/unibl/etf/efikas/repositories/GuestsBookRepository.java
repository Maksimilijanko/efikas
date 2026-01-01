package org.unibl.etf.efikas.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.unibl.etf.efikas.models.entities.GuestsBook;

import java.util.Optional;

public interface GuestsBookRepository extends
        JpaRepository<GuestsBook, Integer>,
        JpaSpecificationExecutor<GuestsBook> {
    Optional<GuestsBook> findByCitizenId(String citizenId);
}
