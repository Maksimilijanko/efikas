package org.unibl.etf.efikas.models.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@Embeddable
public class ApartmentPictureId implements Serializable {
    private static final long serialVersionUID = 2216747693748542686L;
    @Column(name = "\"ApartmentId\"", nullable = false)
    private Integer apartmentId;

    @Column(name = "\"PictureURL\"", nullable = false, length = 100)
    private String pictureURL;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        ApartmentPictureId entity = (ApartmentPictureId) o;
        return Objects.equals(this.pictureURL, entity.pictureURL) &&
                Objects.equals(this.apartmentId, entity.apartmentId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(pictureURL, apartmentId);
    }

}