package org.unibl.etf.efikas.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.unibl.etf.efikas.models.dto.ApartmentExpenseDTO;
import org.unibl.etf.efikas.models.entities.Apartment;
import org.unibl.etf.efikas.models.entities.ApartmentExpense;
import org.unibl.etf.efikas.models.entities.ApartmentExpenseId;
import org.unibl.etf.efikas.models.responses.ApartmentExpenseResponse;
import org.unibl.etf.efikas.repositories.ApartmentExpenseRepository;
import org.unibl.etf.efikas.repositories.ApartmentRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApartmentExpenseService {

    private final ApartmentExpenseRepository apartmentExpenseRepository;
    private final ApartmentRepository apartmentRepository;
    private final ModelMapper modelMapper;

    // Obtain all apartment expenses for a given apartment
    // Perform ownership check before executing the method logic itself
    @PreAuthorize("@userSecurity.isOwner(authentication, #apartmentId)")
    public List<ApartmentExpenseResponse> getAllApartmentExpensesForApartment(Integer apartmentId, Authentication authentication) {
        return apartmentExpenseRepository.findApartmentExpenseByApartmentApartmentId(apartmentId)
                .stream().map((element) -> modelMapper.map(element, ApartmentExpenseResponse.class))
                .collect(Collectors.toList());
    }

    // Create a new expense for a given apartment
    // Perform ownership check before executing the method logic itself
    @PreAuthorize("@userSecurity.isOwner(authentication, #apartmentId)")
    public ApartmentExpenseResponse createNewApartmentExpense(Integer apartmentId, Authentication authentication, ApartmentExpenseDTO expense) {
        ApartmentExpense apartmentExpense = modelMapper.map(expense, ApartmentExpense.class);

        Apartment apartment = apartmentRepository.findById(apartmentId.longValue())
                .orElseThrow(() -> new EntityNotFoundException("Apartment not found!"));

        apartmentExpense.setApartment(apartment);
        ApartmentExpenseId id = new ApartmentExpenseId();
        id.setApartmentId(apartmentId);
        id.setName(expense.getName());

        apartmentExpense.setId(id);

        apartmentExpenseRepository.save(apartmentExpense);

        return modelMapper.map(apartmentExpense, ApartmentExpenseResponse.class);
    }

    @PreAuthorize("@userSecurity.isOwner(authentication, #apartmentId)")
    public ApartmentExpenseResponse updateApartmentExpense(Integer apartmentId, Authentication authentication, ApartmentExpenseDTO expense, String apartmentExpenseName) {
        ApartmentExpenseId apartmentExpenseId = new ApartmentExpenseId();
        apartmentExpenseId.setApartmentId(apartmentId);
        apartmentExpenseId.setName(apartmentExpenseName);

        // I overcomplicated things with this unnecessary composite primary key. Sorry :/
        ApartmentExpense apartmentExpense = apartmentExpenseRepository.findApartmentExpenseById(apartmentExpenseId)
                .orElseThrow(() -> new EntityNotFoundException("Apartment expense not found!"));

        apartmentRepository.findById(apartmentId.longValue())
                .orElseThrow(() -> new EntityNotFoundException("Apartment not found!"));

        apartmentExpenseRepository.delete(apartmentExpense);

        modelMapper.map(expense, apartmentExpense);

        String newName = expense.getName();
        if(newName != null && !newName.equals(apartmentExpense.getId().getName())) {
            ApartmentExpenseId newId = new ApartmentExpenseId();
            newId.setApartmentId(apartmentId);
            newId.setName(newName);
            apartmentExpense.setId(newId);

            apartmentExpense.setId(newId);
        }

        apartmentExpenseRepository.save(apartmentExpense);

        return modelMapper.map(apartmentExpense, ApartmentExpenseResponse.class);
    }

    @PreAuthorize("@userSecurity.isOwner(authentication, #apartmentId)")
    public ApartmentExpenseResponse deleteApartmentExpense(Integer apartmentId, Authentication authentication, String apartmentExpenseName) {
        ApartmentExpenseId apartmentExpenseId = new ApartmentExpenseId();
        apartmentExpenseId.setApartmentId(apartmentId);
        apartmentExpenseId.setName(apartmentExpenseName);

        ApartmentExpense apartmentExpense = apartmentExpenseRepository.findApartmentExpenseById(apartmentExpenseId)
                .orElseThrow(() -> new EntityNotFoundException("Apartment expense not found!"));

        apartmentExpenseRepository.delete(apartmentExpense);

        return modelMapper.map(apartmentExpense, ApartmentExpenseResponse.class);
    }

}
