package org.unibl.etf.efikas.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.unibl.etf.efikas.models.Apartment;
import org.unibl.etf.efikas.models.ApartmentPicture;
import java.util.List;

@Repository
public interface ApartmentPictureRepository extends JpaRepository<ApartmentPicture, Long> {
    List<ApartmentPicture> findApartmentPictureByApartment(Apartment apartment);
}
