package org.unibl.etf.efikas.models.dto.books;

import lombok.Data;
import org.unibl.etf.efikas.models.dto.books.entries.ForeignGuestsEntry;
import org.unibl.etf.efikas.models.requests.BookRequest;

import java.util.List;

@Data
public class ForeignGuestsBookDTO implements BookRequest {
    List<ForeignGuestsEntry> entries;
}
