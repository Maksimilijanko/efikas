package org.unibl.etf.efikas.repositories.specifications;

import org.springframework.data.jpa.domain.Specification;
import org.unibl.etf.efikas.models.entities.ForeignGuestsBook;

import java.time.LocalDate;

public final class ForeignGuestsPdfSpecifications {

    public static Specification<ForeignGuestsBook> forApartment(Integer apartmentId) {
        return (root, query, cb) ->
                cb.equal(root.get("apartment").get("id"), apartmentId);
    }

    public static Specification<ForeignGuestsBook> entryDateFrom(LocalDate from) {
        return (root, query, cb) ->
                from == null
                        ? cb.conjunction()
                        : cb.greaterThanOrEqualTo(root.get("entryDate"), from);
    }

    public static Specification<ForeignGuestsBook> entryDateTo(LocalDate to) {
        return (root, query, cb) ->
                to == null
                        ? cb.conjunction()
                        : cb.lessThanOrEqualTo(root.get("entryDate"), to);
    }

    public static Specification<ForeignGuestsBook> active(Boolean active) {
        if (active == null) return Specification.unrestricted();

        return (root, query, cb) ->
                active
                        ? cb.isNull(root.get("dateTimeOfDeparture"))
                        : cb.isNotNull(root.get("dateTimeOfDeparture"));
    }

    public static Specification<ForeignGuestsBook> orderForPdf() {
        return (root, query, cb) -> {
            query.orderBy(
                    cb.asc(root.get("entryDate")),
                    cb.asc(root.get("dateTimeOfArrival"))
            );
            return cb.conjunction();
        };
    }
}
