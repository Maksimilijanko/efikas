package org.unibl.etf.efikas.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.unibl.etf.efikas.models.entities.AppUser;
import org.unibl.etf.efikas.models.entities.Store;
import org.unibl.etf.efikas.models.responses.AppUserResponse;

public interface StoreRepository extends JpaRepository<Store, Integer> {
    Store findByUser(AppUser appUser);
    Boolean existsByUser(AppUser user);
}
