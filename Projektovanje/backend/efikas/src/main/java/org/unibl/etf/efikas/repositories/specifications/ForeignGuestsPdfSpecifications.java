package org.unibl.etf.efikas.repositories.specifications;

import org.springframework.data.jpa.domain.Specification;
import org.unibl.etf.efikas.models.entities.GuestsBook;

import java.time.LocalDate;

public final class ForeignGuestsPdfSpecifications {

    public static Specification<GuestsBook> entryDateFrom(LocalDate from) {
        return (root, query, cb) ->
                from == null
                        ? cb.conjunction()
                        : cb.greaterThanOrEqualTo(root.get("entryDate"), from);
    }

    public static Specification<GuestsBook> entryDateTo(LocalDate to) {
        return (root, query, cb) ->
                to == null
                        ? cb.conjunction()
                        : cb.lessThanOrEqualTo(root.get("entryDate"), to);
    }

    public static Specification<GuestsBook> active(Boolean active) {
        if (active == null) return Specification.unrestricted();

        return (root, query, cb) ->
                active
                        ? cb.isNull(root.get("dateTimeOfDeparture"))
                        : cb.isNotNull(root.get("dateTimeOfDeparture"));
    }

    public static Specification<GuestsBook> orderForPdf() {
        return (root, query, cb) -> {
            query.orderBy(
                    cb.asc(root.get("entryDate")),
                    cb.asc(root.get("dateTimeOfArrival"))
            );
            return cb.conjunction();
        };
    }
}
