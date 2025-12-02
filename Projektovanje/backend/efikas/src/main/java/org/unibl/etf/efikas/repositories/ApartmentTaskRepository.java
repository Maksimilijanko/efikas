package org.unibl.etf.efikas.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.unibl.etf.efikas.models.entities.ApartmentExpense;
import org.unibl.etf.efikas.models.entities.ApartmentTask;
import org.unibl.etf.efikas.models.entities.ApartmentTaskId;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApartmentTaskRepository extends JpaRepository<ApartmentTask, Long> {
    List<ApartmentTask> findApartmentTaskByApartmentApartmentId(Integer apartment_apartmentId);
    Optional<ApartmentTask> findApartmentTaskById(ApartmentTaskId id);
}
