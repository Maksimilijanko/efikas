-- ============================================
-- MOCK PODACI
-- ============================================

-- USERS
INSERT INTO "efikas"."app_user" ("Name", "Surname", "JIB", "PasswordHash", "Email") VALUES
                                                                                        ('Marko', 'Maksimovic', '1234567890123', 'hash1', 'marko@example.com'),
                                                                                        ('Jelena', 'Petrovic', '9876543210987', 'hash2', 'jelena@example.com'),
                                                                                        ('Nikola', 'Ilic', '5554443332221', 'hash3', 'nikola@example.com');

-- CASH REGISTERS
INSERT INTO "efikas"."cash_register" ("CashRegisterNumber", "SoftwareVersion", "UserId") VALUES
                                                                                             (1001, 'v1.0.0', 1),
                                                                                             (1002, 'v1.1.0', 2),
                                                                                             (1003, 'v1.0.5', 3);

-- APARTMENTS
INSERT INTO "efikas"."apartment" ("Address", "NumberOfBeds", "NumberOfRooms", "Capacity", "PricePerDay", "PricePerNight", "UserId") VALUES
                                                                                                                                        ('Ulica Kneza Milosa 10, Beograd', 2, 1, 3, 60.0, 45.0, 1),
                                                                                                                                        ('Njegoseva 45, Novi Sad', 3, 2, 4, 75.0, 55.0, 2),
                                                                                                                                        ('Kralja Petra 8, Banja Luka', 4, 3, 5, 90.0, 70.0, 3);

-- TRAITS (parking, tv, wifi, fen, klima, ves masina, kafa, balkon)
INSERT INTO "efikas"."apartment_trait" ("ApartmentId", "TraitName", "TraitValue")
SELECT a."ApartmentId", t."TraitName", true
FROM "efikas"."apartment" a
         JOIN (VALUES
                   ('parking'), ('tv'), ('wifi'), ('fen'), ('klima'),
                   ('ves masina'), ('kafa'), ('balkon')
) AS t("TraitName") ON TRUE;

-- APARTMENT PICTURES
INSERT INTO "efikas"."apartment_picture" ("ApartmentId", "PictureURL") VALUES
                                                                           (1, 'https://example.com/img/ap1_1.jpg'),
                                                                           (1, 'https://example.com/img/ap1_2.jpg'),
                                                                           (2, 'https://example.com/img/ap2_1.jpg'),
                                                                           (3, 'https://example.com/img/ap3_1.jpg'),
                                                                           (3, 'https://example.com/img/ap3_2.jpg');

-- APARTMENT TASKS
INSERT INTO "efikas"."apartment_task" ("ApartmentId", "Name", "DateTime", "Note", "Status") VALUES
                                                                                                (1, 'Ciscenje', now(), 'Generalno čišćenje nakon gosta.', false),
                                                                                                (2, 'Zamjena posteljine', now(), 'Promijeniti sve posteljine i peškire.', true),
                                                                                                (3, 'Servis klime', now(), 'Redovno održavanje klima uređaja.', false);

-- DAMAGES
INSERT INTO "efikas"."apartment_damage" ("ApartmentId", "Name", "DamagePrice", "Note", "Status") VALUES
                                                                                                     (1, 'Slomljena čaša', 5.0, 'Manja šteta u kuhinji.', true),
                                                                                                     (2, 'Oguljen zid', 20.0, 'Farba otpala pored kreveta.', false);

-- EXPENSES
INSERT INTO "efikas"."apartment_expense" ("ApartmentId", "Name", "Amount", "Note", "Status") VALUES
                                                                                                 (1, 'Račun za struju', 45.5, 'Mjesečni trošak.', true),
                                                                                                 (1, 'Račun za internet', 15.0, 'Mjesečna pretplata.', true),
                                                                                                 (2, 'Održavanje lifta', 30.0, 'Trošak održavanja zgrade.', false);

-- RESERVATION TYPES
INSERT INTO "efikas"."reservation_type" ("TypeName") VALUES
                                                         ('Dnevni boravak'),
                                                         ('Nocenje');

-- RESERVATIONS
INSERT INTO "efikas"."reservation" (
    "ApartmentId", "GuestFullName", "GuestPhoneNumber",
    "DateTimeOfArrival", "DateTimeOfDeparture", "GuestNumber", "Price",
    "Note", "PersonalDocumentURL", "IdTypeOfReservation", "TypeId"
) VALUES
      (1, 'Petar Jovanovic', '+38164111222', '2025-11-05 14:00:00', '2025-11-07 10:00:00', 2, 120.0, 'Rezervisano online.', NULL, 1, 1),
      (2, 'Ana Nikolic', '+38162123456', '2025-11-06 16:00:00', '2025-11-08 11:00:00', 3, 150.0, 'Pozivom zakazano.', NULL, 2, 2),
      (3, 'Ivan Milic', '+38765111222', '2025-11-10 13:00:00', '2025-11-13 10:00:00', 4, 270.0, 'Direktna rezervacija.', NULL, 3, 2);
