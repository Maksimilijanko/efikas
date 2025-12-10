package org.unibl.etf.efikas.models.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.unibl.etf.efikas.models.enums.Gender;

import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "domestic_guests_book")
public class DomesticGuestsBook {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"DomesticGuestsBookId\"", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "\"ApartmentId\"", nullable = false)
    private Apartment apartment;

    @Column(name = "\"Name\"", nullable = false, length = 50)
    private String name;

    @Column(name = "\"Surname\"", nullable = false, length = 50)
    private String surname;

    @Column(name = "\"Gender\"", columnDefinition = "person_gender not null")
    private Gender gender;

    @Column(name = "\"BirthDate\"", nullable = false)
    private LocalDate birthDate;

    @Column(name = "\"BirthPlace\"", nullable = false, length = 50)
    private String birthPlace;

    @Column(name = "\"BirthMunicipality\"", nullable = false, length = 50)
    private String birthMunicipality;

    @Column(name = "\"BirthCountry\"", nullable = false, length = 50)
    private String birthCountry;

    @Column(name = "\"Address\"", nullable = false, length = 50)
    private String address;

    @Column(name = "\"JMBG\"", nullable = false, length = 13)
    private String jmbg;

    @Column(name = "\"AccomodationUnitNumber\"", nullable = false)
    private Integer accomodationUnitNumber;

    @Column(name = "\"AccomodationUnitFloor\"", nullable = false)
    private Integer accomodationUnitFloor;

    @Column(name = "\"DateTimeOfArrival\"", nullable = false)
    private Instant dateTimeOfArrival;

    @Column(name = "\"DateTimeOfDeparture\"", nullable = false)
    private Instant dateTimeOfDeparture;

    @Column(name = "\"IssuedInvoiceNumber\"", nullable = false)
    private Integer issuedInvoiceNumber;

    @Column(name = "\"Remarks\"", nullable = false, length = 200)
    private String remarks;

    @ColumnDefault("now()")
    @Column(name = "\"CreatedAt\"")
    private Instant createdAt;

}