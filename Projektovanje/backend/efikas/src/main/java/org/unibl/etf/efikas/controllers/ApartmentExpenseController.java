package org.unibl.etf.efikas.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.unibl.etf.efikas.models.responses.ApartmentExpenseResponse;
import org.unibl.etf.efikas.services.ApartmentExpenseService;
import java.util.List;

@RestController
@RequestMapping("/api/v1/apartments")
@RequiredArgsConstructor
public class ApartmentExpenseController {

    private final ApartmentExpenseService apartmentExpenseService;

    @GetMapping("{apartmentId}/expenses")
    public ResponseEntity<?> getApartmentExpenses(@PathVariable Long apartmentId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        List<ApartmentExpenseResponse> expenses =
                apartmentExpenseService.getAllApartmentExpensesForApartment(apartmentId);

        return ResponseEntity.ok(expenses);
    }
}
