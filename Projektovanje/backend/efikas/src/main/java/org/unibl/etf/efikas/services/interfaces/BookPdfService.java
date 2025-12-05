package org.unibl.etf.efikas.services.interfaces;

import org.unibl.etf.efikas.models.requests.BookRequest;

import java.io.IOException;
import java.io.InputStream;

/**
 * Interface for generating different book types.
 * */
public interface BookPdfService <T extends BookRequest> {

    /**
     * Generates a PDF of a financial book.
     * @return InputStream A stream for performance reasons in case of bigger files.
     * */
    InputStream generatePdf(T request) throws IOException;
}
