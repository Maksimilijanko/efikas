package org.unibl.etf.efikas.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.unibl.etf.efikas.models.entities.Apartment;

import java.util.List;

@Repository
public interface ApartmentRepository extends JpaRepository<Apartment, Integer> {
    Apartment findApartmentByApartmentId(Integer apartmentId);
    Apartment findApartmentByAddress(String apartmentAddress);
    List<Apartment> findByUserEmail(String email);
}
