package org.unibl.etf.efikas.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "reservation_type", schema = "efikas")
public class ReservationType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"TypeId\"", nullable = false)
    private Integer id;

    @Column(name = "\"TypeName\"", nullable = false, length = 50)
    private String typeName;

}