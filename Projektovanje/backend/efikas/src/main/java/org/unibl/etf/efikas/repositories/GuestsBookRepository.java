package org.unibl.etf.efikas.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.unibl.etf.efikas.models.entities.GuestsBook;

public interface GuestsBookRepository extends
        JpaRepository<GuestsBook, Integer>,
        JpaSpecificationExecutor<GuestsBook> {
}
