package org.unibl.etf.efikas.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.unibl.etf.efikas.models.dto.ApartmentExpenseDTO;
import org.unibl.etf.efikas.models.responses.ApartmentExpenseResponse;
import org.unibl.etf.efikas.services.ApartmentExpenseService;
import java.util.List;

@RestController
@RequestMapping("/api/v1/apartments")
@RequiredArgsConstructor
public class ApartmentExpenseController {

    private final ApartmentExpenseService apartmentExpenseService;

    @GetMapping("{apartmentId}/expenses")
    public ResponseEntity<?> getApartmentExpenses(@PathVariable Integer apartmentId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        List<ApartmentExpenseResponse> expenses =
                apartmentExpenseService.getAllApartmentExpensesForApartment(apartmentId, authentication);

        return ResponseEntity.ok(expenses);
    }

    @PostMapping("{apartmentId}/expenses")
    public ResponseEntity<?> addApartmentExpense(@PathVariable Integer apartmentId, @RequestBody ApartmentExpenseDTO expense) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        ApartmentExpenseResponse response = apartmentExpenseService.createNewExpense(apartmentId, authentication, expense);

        return ResponseEntity.ok(response);
    }
}
