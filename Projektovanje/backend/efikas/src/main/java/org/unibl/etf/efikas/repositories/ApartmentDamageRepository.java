package org.unibl.etf.efikas.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.unibl.etf.efikas.models.entities.ApartmentDamage;

@Repository
public interface ApartmentDamageRepository extends JpaRepository<ApartmentDamage, Long> {

}
