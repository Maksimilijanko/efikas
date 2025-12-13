package org.unibl.etf.efikas.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.unibl.etf.efikas.repositories.DomesticGuestsBookRepository;

@Service
@RequiredArgsConstructor
public class DomesticGuestsBookService {
    private final DomesticGuestsBookRepository domesticGuestsBookRepository;


}
