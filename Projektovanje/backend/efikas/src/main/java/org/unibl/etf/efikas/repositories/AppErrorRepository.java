package org.unibl.etf.efikas.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.unibl.etf.efikas.models.entities.AppError;

public interface AppErrorRepository extends JpaRepository<AppError, Long> {
}
