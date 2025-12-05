package org.unibl.etf.efikas.services.impl.books;

import org.springframework.stereotype.Service;
import org.unibl.etf.efikas.models.dto.books.ExpensesBookDTO;
import org.unibl.etf.efikas.models.enums.BookType;
import org.unibl.etf.efikas.services.interfaces.BookPdfService;
import org.unibl.etf.efikas.services.interfaces.BookTypeHandler;

import java.io.IOException;
import java.io.InputStream;

@Service
public class ExpensesBookPdfService implements BookPdfService<ExpensesBookDTO>, BookTypeHandler {
    @Override
    public InputStream generatePdf(ExpensesBookDTO request) throws IOException {
        return null;
    }

    @Override
    public BookType getSupportedType() {
        return BookType.EXPENSES;
    }
}
