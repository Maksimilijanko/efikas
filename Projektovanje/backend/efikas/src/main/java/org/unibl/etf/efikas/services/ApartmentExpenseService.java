package org.unibl.etf.efikas.services;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
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
    public List<ApartmentExpenseResponse> getAllApartmentExpensesForApartment(Integer apartmentId) {
        return apartmentExpenseRepository.findApartmentExpenseByApartmentApartmentId(apartmentId)
                .stream().map((element) -> modelMapper.map(element, ApartmentExpenseResponse.class))
                .collect(Collectors.toList());
    }


}
