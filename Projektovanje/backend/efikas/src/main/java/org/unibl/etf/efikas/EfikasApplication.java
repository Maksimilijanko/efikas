package org.unibl.etf.efikas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class EfikasApplication {

    public static void main(String[] args) {
        SpringApplication.run(EfikasApplication.class, args);
    }

}
