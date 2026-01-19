package org.unibl.etf.efikas.models.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "reservation", schema = "efikas")
@ToString
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"ReservationId\"", nullable = false)
    private Integer reservationId;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "\"ApartmentId\"", nullable = false)
    private Apartment apartment;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "\"GuestId\"", nullable = false)
    private GuestsBook guest;

    @NotNull
    @Column(name = "\"GuestQuantity\"", nullable = false)
    private Integer guestQuantity;

    @Column(name = "\"Price\"")
    private Double price;

    @Size(max = 256)
    @Column(name = "\"Note\"", length = 256)
    private String note;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "\"TypeId\"", nullable = false)
    private ReservationType type;

}