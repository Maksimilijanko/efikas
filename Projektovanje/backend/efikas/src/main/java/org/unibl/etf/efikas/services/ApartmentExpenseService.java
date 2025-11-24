package org.unibl.etf.efikas.services;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.unibl.etf.efikas.models.responses.ApartmentExpenseResponse;
import org.unibl.etf.efikas.repositories.ApartmentExpenseRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApartmentExpenseService {

    private final ApartmentExpenseRepository apartmentExpenseRepository;
    private final ModelMapper modelMapper;

    // Obtain all apartment expenses for a given apartment
    @PreAuthorize("@userSecurity.isOwner(authentication, #apartmentId)")
    public List<ApartmentExpenseResponse> getAllApartmentExpensesForApartment(Integer apartmentId, Authentication authentication) {
        return apartmentExpenseRepository.findApartmentExpenseByApartmentApartmentId(apartmentId)
                .stream().map((element) -> modelMapper.map(element, ApartmentExpenseResponse.class))
                .collect(Collectors.toList());
    }


}
