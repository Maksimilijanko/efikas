package org.unibl.etf.efikas.services;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.unibl.etf.efikas.models.dto.ApartmentDamageDTO;
import org.unibl.etf.efikas.models.entities.Apartment;
import org.unibl.etf.efikas.models.entities.ApartmentDamage;
import org.unibl.etf.efikas.models.entities.ApartmentDamageId;
import org.unibl.etf.efikas.models.responses.ApartmentDamageResponse;
import org.unibl.etf.efikas.repositories.DomesticGuestsBookRepository;

@Service
public class DomesticGuestsBookService {
    private final DomesticGuestsBookRepository domesticGuestsBookRepository;

    public DomesticGuestsBookService(DomesticGuestsBookRepository domesticGuestsBookRepository) {
        this.domesticGuestsBookRepository = domesticGuestsBookRepository;
    }


}
