package org.unibl.etf.efikas.services.impl.books;

import org.springframework.stereotype.Service;
import org.unibl.etf.efikas.models.dto.books.DomesticGuestsBookDTO;
import org.unibl.etf.efikas.models.dto.books.IncomeBookDTO;
import org.unibl.etf.efikas.models.enums.BookType;
import org.unibl.etf.efikas.services.interfaces.BookPdfService;
import org.unibl.etf.efikas.services.interfaces.BookTypeHandler;

import java.io.IOException;
import java.io.InputStream;

@Service
public class DomesticGuestsBookPdfService implements BookPdfService<DomesticGuestsBookDTO>, BookTypeHandler {
    @Override
    public InputStream generatePdf(DomesticGuestsBookDTO request) throws IOException {
        return null;
    }

    @Override
    public BookType getSupportedType() {
        return BookType.DOMESTIC_GUESTS;
    }
}
