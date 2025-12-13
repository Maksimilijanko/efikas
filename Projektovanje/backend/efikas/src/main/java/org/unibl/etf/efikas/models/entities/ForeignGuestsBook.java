package org.unibl.etf.efikas.models.entities;

import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.*;
import org.hibernate.type.SqlTypes;
import org.unibl.etf.efikas.models.enums.Gender;

import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@ToString
@Entity
@Table(name = "foreign_guests_book", schema = "efikas")
public class ForeignGuestsBook {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"ForeignGuestsBookId\"", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "\"ApartmentId\"", nullable = false)
    private Apartment apartment;

    @Column(name = "\"Name\"", nullable = false, length = 50)
    private String name;

    @Column(name = "\"Surname\"", nullable = false, length = 50)
    private String surname;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "\"Gender\"", columnDefinition = "person_gender not null")
    private Gender gender;

    @Column(name = "\"BirthDate\"", nullable = false)
    private LocalDate birthDate;

    @Column(name = "\"BirthPlace\"", nullable = false, length = 50)
    private String birthPlace;

    @Column(name = "\"BirthCountry\"", nullable = false, length = 50)
    private String birthCountry;

    @Column(name = "\"Address\"", nullable = false, length = 50)
    private String address;

    @Column(name = "\"Citizenship\"", nullable = false, length = 50)
    private String citizenship;

    @Column(name = "\"PassportNumber\"", nullable = false, length = 20)
    private String passportNumber;

    @Column(name = "\"PassportIssuedDate\"", nullable = false)
    private LocalDate passportIssuedDate;

    @Column(name = "\"VisaType\"", nullable = false, length = 20)
    private String visaType;

    @Column(name = "\"VisaNumber\"", nullable = false, length = 20)
    private String visaNumber;

    // Ivan: OVDJE NEDOSTAJE 'datum dozvole boravka' - permittedResidenceDate, zaboravio unijeti u bazu :/

    @Column(name = "\"EntryDate\"", nullable = false)
    private LocalDate entryDate;

    @Column(name = "\"EntryPlace\"", nullable = false, length = 20)
    private String entryPlace;

    @Column(name = "\"AccomodationUnitNumber\"", nullable = false)
    private Integer accommodationUnitNumber;

    @Column(name = "\"AccomodationUnitFloor\"", nullable = false)
    private Integer accommodationUnitFloor;

    @Column(name = "\"DateTimeOfArrival\"", nullable = false)
    private Instant dateTimeOfArrival;

    @Column(name = "\"DateTimeOfDeparture\"", nullable = false)
    private Instant dateTimeOfDeparture;

    @Column(name = "\"IssuedInvoiceNumber\"", nullable = false)
    private Integer issuedInvoiceNumber;

    @Column(name = "\"Remarks\"", nullable = false, length = 200)
    private String remarks;

    @ColumnDefault("now()")
    @CreationTimestamp
    @Column(name = "\"CreatedAt\"", nullable = false, updatable = false)
    private Instant createdAt;

}