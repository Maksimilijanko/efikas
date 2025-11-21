package org.unibl.etf.efikas.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.unibl.etf.efikas.models.dto.ApartmentCreateDTO;
import org.unibl.etf.efikas.models.responses.ApartmentResponse;
import org.unibl.etf.efikas.services.ApartmentService;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/apartments")
@RequiredArgsConstructor
public class ApartmentController {

    private final ApartmentService apartmentService;

    @GetMapping
    public ResponseEntity<?> getApartments(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        List<ApartmentResponse> apartments = apartmentService.getApartmentsForUser(email);

        return ResponseEntity.ok(apartments);
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> createApartment(
            @RequestPart("apartment") String apartmentJson,
            @RequestPart("pictures") List<MultipartFile> pictures) throws IOException {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        ObjectMapper mapper = new ObjectMapper();
        ApartmentCreateDTO request = mapper.readValue(apartmentJson, ApartmentCreateDTO.class);

        ApartmentResponse response = apartmentService.createApartmentWithFiles(request, pictures, email);

        return ResponseEntity.ok(response);
    }
}
