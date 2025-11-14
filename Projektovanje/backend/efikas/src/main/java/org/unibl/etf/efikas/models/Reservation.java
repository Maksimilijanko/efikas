package org.unibl.etf.efikas.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "reservation", schema = "efikas")
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"ReservationId\"", nullable = false)
    private Integer reservationId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "\"ApartmentId\"", nullable = false)
    private Apartment apartment;

    @Column(name = "\"GuestFullName\"", nullable = false, length = 100)
    private String guestFullName;

    @Column(name = "\"GuestPhoneNumber\"", nullable = false, length = 30)
    private String guestPhoneNumber;

    @Column(name = "\"DateTimeOfArrival\"", nullable = false)
    private Instant dateTimeOfArrival;

    @Column(name = "\"DateTimeOfDeparture\"", nullable = false)
    private Instant dateTimeOfDeparture;

    @Column(name = "\"GuestNumber\"", nullable = false)
    private Integer guestNumber;

    @Column(name = "\"Price\"")
    private Double price;

    @Column(name = "\"Note\"", length = 256)
    private String note;

    @Column(name = "\"PersonalDocumentURL\"", length = 100)
    private String personalDocumentURL;

    @Column(name = "\"IdTypeOfReservation\"", nullable = false)
    private Integer idTypeOfReservation;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "\"TypeId\"", nullable = false)
    private ReservationType type;

}