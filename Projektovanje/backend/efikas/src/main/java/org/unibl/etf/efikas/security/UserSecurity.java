package org.unibl.etf.efikas.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.unibl.etf.efikas.models.entities.Apartment;
import org.unibl.etf.efikas.repositories.ApartmentRepository;

@Component("userSecurity")
@RequiredArgsConstructor
public class UserSecurity {

    private final ApartmentRepository apartmentRepository;

    // Check if the user is the owner of the apartment
    public boolean isOwner(Authentication authentication, Long apartmentId) {
        String email = authentication.getName();

        return apartmentRepository.findById(apartmentId)
                .map(Apartment::getUser)
                .map(user -> user.getEmail().equals(email))
                .orElse(false);
    }
}
