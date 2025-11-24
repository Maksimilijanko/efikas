package org.unibl.etf.efikas.configs;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.unibl.etf.efikas.models.entities.ApartmentExpense;
import org.unibl.etf.efikas.models.responses.ApartmentExpenseResponse;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper mapper = new ModelMapper();

        mapper.getConfiguration().setAmbiguityIgnored(true);
        // Provide custom mapping for ApartmentExpenseResponse
        mapper.typeMap(ApartmentExpense.class, ApartmentExpenseResponse.class)
                .addMappings(m -> m.map(src -> src.getApartment().getApartmentId(),
                        ApartmentExpenseResponse::setApartmentId));


        return mapper;
    }
}
