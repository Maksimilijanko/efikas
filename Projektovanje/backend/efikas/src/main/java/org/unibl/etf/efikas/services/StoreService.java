package org.unibl.etf.efikas.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.unibl.etf.efikas.exceptions.StoreExistsException;
import org.unibl.etf.efikas.models.dto.books.StoreDTO;
import org.unibl.etf.efikas.models.entities.AppUser;
import org.unibl.etf.efikas.models.entities.Store;
import org.unibl.etf.efikas.models.requests.CreateStoreRequest;
import org.unibl.etf.efikas.repositories.AppUserRepository;
import org.unibl.etf.efikas.repositories.StoreRepository;

@Service
@AllArgsConstructor
public class StoreService {
    private final StoreRepository storeRepository;
    private final AppUserRepository appUserRepository;
    private final ModelMapper modelMapper;

    public StoreDTO getStoreForActiveUser(Authentication authentication) {
        String email = authentication.getName();
        System.out.println("EMAIL: " + email);
        AppUser user = appUserRepository.findByEmail(email).orElseThrow(() -> new EntityNotFoundException("Store for user not found"));
        Store store = storeRepository.findByUser(user).orElseThrow(() -> new EntityNotFoundException("Store for user not found"));

        return modelMapper.map(store, StoreDTO.class);
    }

    public StoreDTO createStore(CreateStoreRequest createStoreRequest, Authentication authentication) {
        String email = authentication.getName();
        AppUser user = appUserRepository.findByEmail(email).orElseThrow(() -> new EntityNotFoundException("User not found"));

        Boolean userHasStore = storeRepository.existsByUser(user);
        if(userHasStore){
            throw new StoreExistsException();
        }

        Store store = modelMapper.map(createStoreRequest, Store.class);
        store.setUser(user);

        storeRepository.save(store);
        return modelMapper.map(store, StoreDTO.class);
    }

}
