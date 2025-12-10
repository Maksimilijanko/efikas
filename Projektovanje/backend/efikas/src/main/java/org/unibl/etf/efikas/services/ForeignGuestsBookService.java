package org.unibl.etf.efikas.services;

import org.springframework.stereotype.Service;
import org.unibl.etf.efikas.repositories.ForeignGuestsBookRepository;

@Service
public class ForeignGuestsBookService {
    private final ForeignGuestsBookRepository foreignGuestsBookRepository;

    public ForeignGuestsBookService(ForeignGuestsBookRepository foreignGuestsBookRepository) {
        this.foreignGuestsBookRepository = foreignGuestsBookRepository;
    }
}
