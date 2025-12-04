DROP SCHEMA IF EXISTS efikas CASCADE;
CREATE SCHEMA efikas;

CREATE TABLE efikas."app_user" (
                                   "UserId" SERIAL PRIMARY KEY,
                                   "Name" varchar(50) NOT NULL,
                                   "Surname" varchar(50) NOT NULL,
                                   "JIB" char(13) NOT NULL,
                                   "PasswordHash" varchar(512) NOT NULL,
                                   "Email" varchar(50) NOT NULL
);

CREATE TABLE efikas."apartment" (
                                    "ApartmentId" SERIAL PRIMARY KEY,
                                    "Address" varchar(100) NOT NULL,
                                    "NumberOfBeds" int NOT NULL,
                                    "NumberOfRooms" int NOT NULL,
                                    "Capacity" int NOT NULL,
                                    "PricePerDay" DOUBLE PRECISION NOT NULL,
                                    "PricePerNight" DOUBLE PRECISION NOT NULL,
                                    "UserId" int NOT NULL,
                                    CONSTRAINT "FK_apartment_user" FOREIGN KEY ("UserId")
                                        REFERENCES efikas."app_user"("UserId")
                                        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE efikas."cash_register" (
                                        "CashRegisterId" SERIAL PRIMARY KEY,
                                        "CashRegisterNumber" int NOT NULL,
                                        "SoftwareVersion" varchar(15) NOT NULL,
                                        "UserId" int NOT NULL,
                                        CONSTRAINT "FK_cash_register_user" FOREIGN KEY("UserId")
                                            REFERENCES efikas."app_user"("UserId")
                                            ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE efikas."apartment_trait" (
                                          "ApartmentId" int NOT NULL,
                                          "TraitName" varchar(15) NOT NULL,
                                          "TraitValue" BOOLEAN NOT NULL,
                                          CONSTRAINT "PK_apartment_trait" PRIMARY KEY ("ApartmentId", "TraitName"),
                                          CONSTRAINT "FK_apartment_trait_apartment" FOREIGN KEY ("ApartmentId")
                                              REFERENCES efikas."apartment"("ApartmentId")
                                              ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE efikas."apartment_picture" (
                                            "ApartmentId" int NOT NULL,
                                            "PictureURL" varchar(100) NOT NULL,
                                            CONSTRAINT "PK_apartment_picture" PRIMARY KEY ("ApartmentId", "PictureURL"),
                                            CONSTRAINT "FK_apartment_picture_apartment" FOREIGN KEY ("ApartmentId")
                                                REFERENCES efikas."apartment"("ApartmentId")
                                                ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE efikas."apartment_task" (
                                         "ApartmentId" int NOT NULL,
                                         "Name" varchar(20) NOT NULL,
                                         "DateTime" TIMESTAMP NOT NULL,
                                         "Note" varchar(256),
                                         "Status" BOOLEAN NOT NULL,
                                         CONSTRAINT "PK_apartment_task" PRIMARY KEY ("ApartmentId", "Name"),
                                         CONSTRAINT "FK_apartment_task_apartment" FOREIGN KEY ("ApartmentId")
                                             REFERENCES efikas."apartment"("ApartmentId")
                                             ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE efikas."apartment_damage" (
                                           "ApartmentId" int NOT NULL,
                                           "Name" varchar(100) NOT NULL,
                                           "DamagePrice" DOUBLE PRECISION,
                                           "Note" varchar(256) NOT NULL,
                                           "Status" BOOLEAN NOT NULL,
                                           CONSTRAINT "PK_apartment_damage" PRIMARY KEY ("ApartmentId", "Name"),
                                           CONSTRAINT "FK_apartment_damage_apartment" FOREIGN KEY ("ApartmentId")
                                               REFERENCES efikas."apartment"("ApartmentId")
                                               ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE efikas."apartment_expense" (
                                            "ApartmentId" int NOT NULL,
                                            "Name" varchar(100) NOT NULL,
                                            "Amount" DOUBLE PRECISION NOT NULL,
                                            "Note" varchar(256) NOT NULL,
                                            "Status" BOOLEAN NOT NULL,
                                            CONSTRAINT "PK_apartment_expense" PRIMARY KEY ("ApartmentId", "Name"),
                                            CONSTRAINT "FK_apartment_expense_apartment" FOREIGN KEY ("ApartmentId")
                                                REFERENCES efikas."apartment"("ApartmentId")
                                                ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE efikas."reservation_type" (
                                           "TypeId" SERIAL PRIMARY KEY,
                                           "TypeName" varchar(50) NOT NULL
);

CREATE TABLE efikas."reservation" (
                                      "ApartmentId" int NOT NULL,
                                      "ReservationId" SERIAL PRIMARY KEY,
                                      "GuestFullName" varchar(100) NOT NULL,
                                      "GuestPhoneNumber" varchar(30) NOT NULL,
                                      "DateTimeOfArrival" TIMESTAMP NOT NULL,
                                      "DateTimeOfDeparture" TIMESTAMP NOT NULL,
                                      "GuestNumber" int NOT NULL,
                                      "Price" DOUBLE PRECISION,
                                      "Note" varchar(256),
                                      "PersonalDocumentURL" varchar(100),
                                      "IdTypeOfReservation" int NOT NULL,           -- do we need this?
                                      "TypeId" int NOT NULL,
                                      CONSTRAINT "FK_reservation_apartment" FOREIGN KEY ("ApartmentId")
                                          REFERENCES efikas."apartment"("ApartmentId")
                                          ON UPDATE CASCADE ON DELETE CASCADE,
                                      CONSTRAINT "FK_reservation_reservation_type" FOREIGN KEY ("TypeId")
                                          REFERENCES efikas."reservation_type"("TypeId")
                                          ON UPDATE CASCADE ON DELETE CASCADE
);

ALTER TABLE efikas."reservation" DROP COLUMN "IdTypeOfReservation";

select * from efikas.app_user;
select * from efikas.reservation;
select * from efikas.reservation_type;
select * from efikas.apartment;

