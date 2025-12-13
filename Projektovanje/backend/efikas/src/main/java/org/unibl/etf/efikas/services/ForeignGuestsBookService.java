package org.unibl.etf.efikas.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.unibl.etf.efikas.repositories.ForeignGuestsBookRepository;

@Service
@RequiredArgsConstructor
public class ForeignGuestsBookService {
    private final ForeignGuestsBookRepository foreignGuestsBookRepository;


}
