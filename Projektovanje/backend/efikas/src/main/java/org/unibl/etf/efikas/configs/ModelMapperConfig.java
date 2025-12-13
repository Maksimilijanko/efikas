package org.unibl.etf.efikas.configs;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.unibl.etf.efikas.models.dto.ReservationDTO;
import org.unibl.etf.efikas.models.entities.ApartmentDamage;
import org.unibl.etf.efikas.models.entities.ApartmentExpense;
import org.unibl.etf.efikas.models.entities.ApartmentTask;
import org.unibl.etf.efikas.models.entities.Reservation;
import org.unibl.etf.efikas.models.responses.ApartmentDamageResponse;
import org.unibl.etf.efikas.models.responses.ApartmentExpenseResponse;
import org.unibl.etf.efikas.models.responses.ApartmentTaskResponse;
import org.unibl.etf.efikas.models.responses.ReservationResponse;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper mapper = new ModelMapper();

        mapper.getConfiguration().setAmbiguityIgnored(true);
        // Provide custom mapping for ApartmentExpenseResponse
        mapper.createTypeMap(ApartmentExpense.class, ApartmentExpenseResponse.class)
                .addMapping(
                        source -> source.getId().getName(),
                        ApartmentExpenseResponse::setName
                )
                .addMapping(
                        source -> source.getId().getApartmentId(),
                        ApartmentExpenseResponse::setApartmentId
                );

        // Provide custom mapping for ApartmentDamageResponse
        mapper.createTypeMap(ApartmentDamage.class, ApartmentDamageResponse.class)
                .addMapping(
                        source -> source.getId().getName(),
                        ApartmentDamageResponse::setName
                )
                .addMapping(
                        source -> source.getId().getApartmentId(),
                        ApartmentDamageResponse::setApartmentId
                );

        // Provide custom mapping for ApartmentTaskResponse
        mapper.createTypeMap(ApartmentTask.class, ApartmentTaskResponse.class)
                .addMapping(
                        source -> source.getId().getName(),
                        ApartmentTaskResponse::setName
                )
                .addMapping(
                        source -> source.getId().getApartmentId(),
                        ApartmentTaskResponse::setApartmentId
                );

        mapper.createTypeMap(Reservation.class, ReservationResponse.class)
                .addMapping(source -> source.getType().getTypeName(), ReservationResponse::setReservationType);

        // We skip the reservationId when creating a Reservation from ReservationDTO
        mapper.createTypeMap(ReservationDTO.class, Reservation.class)
                .addMappings(m -> m.skip(Reservation::setReservationId));


        return mapper;
    }
}
