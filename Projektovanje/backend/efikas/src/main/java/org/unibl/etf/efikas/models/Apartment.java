package org.unibl.etf.efikas.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "apartment", schema = "efikas")
public class Apartment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"ApartmentId\"", nullable = false)
    private Integer apartmentId;

    @Column(name = "\"Address\"", nullable = false, length = 100)
    private String address;

    @Column(name = "\"NumberOfBeds\"", nullable = false)
    private Integer numberOfBeds;

    @Column(name = "\"NumberOfRooms\"", nullable = false)
    private Integer numberOfRooms;

    @Column(name = "\"Capacity\"", nullable = false)
    private Integer capacity;

    @Column(name = "\"PricePerDay\"", nullable = false)
    private Double pricePerDay;

    @Column(name = "\"PricePerNight\"", nullable = false)
    private Double pricePerNight;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "\"UserId\"", nullable = false)
    private AppUser user;

    // TODO: change ApartmentTrait to be here, even though it's OneToMany multiplicity

}