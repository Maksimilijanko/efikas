package org.unibl.etf.efikas.repositories.specifications;

import org.springframework.data.jpa.domain.Specification;
import org.unibl.etf.efikas.models.entities.DomesticGuestsBook;

import java.time.LocalDate;
import java.time.LocalDateTime;

public final class DomesticGuestsPdfSpecifications {
    public static Specification<DomesticGuestsBook> forApartment(Integer apartmentId) {
        return (root, query, cb) ->
                cb.equal(root.get("apartment").get("id"), apartmentId);
    }

    public static Specification<DomesticGuestsBook> dateOfArrival(LocalDate from) {
        return (root, query, cb) ->
                from == null
                        ? cb.conjunction()
                        : cb.greaterThanOrEqualTo(root.get("dateTimeOfArrival"), from);
    }

    public static Specification<DomesticGuestsBook> dateOfDeparture(LocalDate to) {
        return (root, query, cb) ->
                to == null
                        ? cb.conjunction()
                        : cb.lessThanOrEqualTo(root.get("dateTimeOfDeparture"), to);
    }

    public static Specification<DomesticGuestsBook> active(Boolean active) {
        if (active == null) return Specification.unrestricted();

        LocalDateTime now = LocalDateTime.now();

        return (root, query, cb) ->
                active
                        ? cb.or(
                        cb.isNull(root.get("dateTimeOfDeparture")),
                        cb.greaterThan(root.get("dateTimeOfDeparture"), now)
                )
                        : cb.lessThanOrEqualTo(root.get("dateTimeOfDeparture"), now);
    }

    public static Specification<DomesticGuestsBook> orderForPdf() {
        return (root, query, cb) -> {
            query.orderBy(
                    cb.asc(root.get("dateTimeOfArrival")),
                    cb.asc(root.get("dateTimeOfDeparture"))
            );
            return cb.conjunction();
        };
    }
}
