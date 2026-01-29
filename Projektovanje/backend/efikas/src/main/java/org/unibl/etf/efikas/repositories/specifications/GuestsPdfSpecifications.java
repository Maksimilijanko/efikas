package org.unibl.etf.efikas.repositories.specifications;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;
import org.unibl.etf.efikas.models.entities.Apartment;
import org.unibl.etf.efikas.models.entities.GuestsBook;
import org.unibl.etf.efikas.models.entities.Reservation;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public final class GuestsPdfSpecifications {
    public static Specification<GuestsBook> dateOfArrival(LocalDate from) {
        return (root, query, cb) ->
                from == null
                        ? cb.conjunction()
                        : cb.greaterThanOrEqualTo(
                            root.get("dateTimeOfArrival"),
                            from.atStartOfDay()
                        );
    }

    public static Specification<GuestsBook> dateOfDeparture(LocalDate to) {
        return (root, query, cb) ->
                to == null
                        ? cb.conjunction()
                        : cb.lessThanOrEqualTo(
                            root.get("dateTimeOfDeparture"),
                            to.atTime(LocalTime.MAX)
                        );
    }

    public static Specification<GuestsBook> active(Boolean active) {
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

    public static Specification<GuestsBook> orderForPdf() {
        return (root, query, cb) -> {
            query.orderBy(
                    cb.asc(root.get("dateTimeOfArrival")),
                    cb.asc(root.get("dateTimeOfDeparture"))
            );
            return cb.conjunction();
        };
    }

    public static Specification<GuestsBook> isLocal() {
        return (root, query, cb) -> cb.equal(root.get("isLocal"), true);
    }

    public static Specification<GuestsBook> isForeign() {
        return (root, query, cb) -> cb.equal(root.get("isLocal"), false);
    }

    public static Specification<GuestsBook> belongsToUser(Integer userId) {
        return (root, query, cb) -> {
            query.distinct(true);

            Join<GuestsBook, Reservation> reservationJoin =
                    root.join("reservations", JoinType.INNER);

            Join<Reservation, Apartment> apartmentJoin =
                    reservationJoin.join("apartment", JoinType.INNER);

            return cb.equal(
                    apartmentJoin.get("user").get("userId"),
                    userId
            );
        };
    }
}
