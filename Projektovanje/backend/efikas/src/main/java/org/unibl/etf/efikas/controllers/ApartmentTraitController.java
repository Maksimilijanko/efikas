package org.unibl.etf.efikas.controllers;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.unibl.etf.efikas.models.entities.ApartmentTraitId;
import org.unibl.etf.efikas.models.enums.ApartmentTrait;
import org.unibl.etf.efikas.models.responses.ApartmentTraitResponse;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping("api/v1/apartment-traits")
@RequiredArgsConstructor
public class ApartmentTraitController {

    private final ModelMapper modelMapper;

    @GetMapping
    public List<ApartmentTraitResponse> getApartmentTraits(){
        return Stream.of(ApartmentTrait.values())
                .map(e -> modelMapper.map(e, ApartmentTraitResponse.class)).collect(Collectors.toList());
    }
}
