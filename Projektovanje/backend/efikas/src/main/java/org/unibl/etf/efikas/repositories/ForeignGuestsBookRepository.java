package org.unibl.etf.efikas.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.unibl.etf.efikas.models.entities.ForeignGuestsBook;


public interface ForeignGuestsBookRepository extends JpaRepository<ForeignGuestsBook, Integer> {
}
