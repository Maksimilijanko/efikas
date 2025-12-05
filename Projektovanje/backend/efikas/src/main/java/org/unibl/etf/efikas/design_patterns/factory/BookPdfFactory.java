package org.unibl.etf.efikas.design_patterns.factory;

import org.springframework.stereotype.Component;
import org.unibl.etf.efikas.models.enums.BookType;
import org.unibl.etf.efikas.models.requests.BookRequest;
import org.unibl.etf.efikas.services.interfaces.BookPdfService;
import org.unibl.etf.efikas.services.interfaces.BookTypeHandler;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class BookPdfFactory {
    private final Map<BookType, BookPdfService<? extends BookRequest>> registry;

    // Sva sreca pa Spring manage-uje bean-ovima, da se automatski populiše
    public BookPdfFactory(List<BookTypeHandler> handlers) {
        this.registry = handlers.stream()
                .collect(Collectors.toMap(
                        BookTypeHandler::getSupportedType,
                        handler -> (BookPdfService<?>) handler
                ));
    }

    @SuppressWarnings("unchecked")
    public <R extends BookRequest> BookPdfService<R> get(BookType type) {
        return (BookPdfService<R>) registry.get(type);
    }
}
