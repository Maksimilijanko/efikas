package org.unibl.etf.efikas.services;

import org.springframework.stereotype.Service;
import org.unibl.etf.efikas.repositories.DomesticGuestsBookRepository;

@Service
public class DomesticGuestsBookService {
    private final DomesticGuestsBookRepository domesticGuestsBookRepository;

    public DomesticGuestsBookService(DomesticGuestsBookRepository domesticGuestsBookRepository) {
        this.domesticGuestsBookRepository = domesticGuestsBookRepository;
    }
}
