package org.unibl.etf.efikas.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "apartment_picture", schema = "efikas")
public class ApartmentPicture {
    @EmbeddedId
    private ApartmentPictureId id;

    @MapsId("apartmentId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "\"ApartmentId\"", nullable = false)
    private Apartment apartment;

}