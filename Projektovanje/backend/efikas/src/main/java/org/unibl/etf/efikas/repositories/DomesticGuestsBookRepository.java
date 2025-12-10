package org.unibl.etf.efikas.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.unibl.etf.efikas.models.entities.AppUser;
import org.unibl.etf.efikas.models.entities.DomesticGuestsBook;

public interface DomesticGuestsBookRepository extends JpaRepository<DomesticGuestsBook, Integer> {
}
