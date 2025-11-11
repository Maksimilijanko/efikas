package org.unibl.etf.efikas.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "app_user", schema = "efikas")
public class AppUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"UserId\"", nullable = false)
    private Integer id;

    @Column(name = "\"Name\"", nullable = false, length = 50)
    private String name;

    @Column(name = "\"Surname\"", nullable = false, length = 50)
    private String surname;

    @Column(name = "\"JIB\"", nullable = false, length = 13)
    private String jib;

    @Column(name = "\"PasswordHash\"", nullable = false, length = 512)
    private String passwordHash;

    @Column(name = "\"Email\"", nullable = false, length = 50)
    private String email;

}