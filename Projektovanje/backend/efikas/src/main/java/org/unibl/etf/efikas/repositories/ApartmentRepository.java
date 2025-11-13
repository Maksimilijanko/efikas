package org.unibl.etf.efikas.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.unibl.etf.efikas.models.Apartment;

@Repository
public interface ApartmentRepository extends JpaRepository<Apartment, Long> {
    Apartment findApartmentByApartmentId(Long apartmentId);
    Apartment findApartmentByAddress(String apartmentAddress);
}
