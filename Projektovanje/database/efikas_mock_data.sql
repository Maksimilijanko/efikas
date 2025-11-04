use efikas;

-- ============================================
-- MOCK PODACI
-- ============================================

-- USERS
insert into user (Name, Surname, JIB, PasswordHash, Email) values
('Marko', 'Maksimovic', '1234567890123', 'hash1', 'marko@example.com'),
('Jelena', 'Petrovic', '9876543210987', 'hash2', 'jelena@example.com'),
('Nikola', 'Ilic', '5554443332221', 'hash3', 'nikola@example.com');

-- CASH REGISTERS
insert into cash_register values
(1, 1001, 'v1.0.0', 1),
(2, 1002, 'v1.1.0', 2),
(3, 1003, 'v1.0.5', 3);

-- APARTMENTS
insert into apartment (Address, NumberOfBeds, NumberOfRooms, Capacity, PricePerDay, PricePerNight, UserId) values
('Ulica Kneza Milosa 10, Beograd', 2, 1, 3, 60.0, 45.0, 1),
('Njegoseva 45, Novi Sad', 3, 2, 4, 75.0, 55.0, 2),
('Kralja Petra 8, Banja Luka', 4, 3, 5, 90.0, 70.0, 3);

-- TRAITS (parking, tv, wifi, fen, klima, ves masina, kafa, balkon)
insert into apartment_trait (ApartmentId, TraitName, TraitValue)
select a.ApartmentId, t.TraitName, true
from apartment a
join (select 'parking' as TraitName
      union select 'tv'
      union select 'wifi'
      union select 'fen'
      union select 'klima'
      union select 'ves masina'
      union select 'kafa'
      union select 'balkon') t;

-- APARTMENT PICTURES
insert into apartment_picture values
(1, 'https://example.com/img/ap1_1.jpg'),
(1, 'https://example.com/img/ap1_2.jpg'),
(2, 'https://example.com/img/ap2_1.jpg'),
(3, 'https://example.com/img/ap3_1.jpg'),
(3, 'https://example.com/img/ap3_2.jpg');

-- APARTMENT TASKS
insert into apartment_task values
(1, 'Ciscenje', now(), 'Generalno čišćenje nakon gosta.', false),
(2, 'Zamjena posteljine', now(), 'Promijeniti sve posteljine i peškire.', true),
(3, 'Servis klime', now(), 'Redovno održavanje klima uređaja.', false);

-- DAMAGES
insert into apartment_damage values
(1, 'Slomljena čaša', 5.0, 'Manja šteta u kuhinji.', true),
(2, 'Oguljen zid', 20.0, 'Farba otpala pored kreveta.', false);

-- EXPENSES
insert into apartment_expense values
(1, 'Račun za struju', 45.5, 'Mjesečni trošak.', true),
(1, 'Račun za internet', 15.0, 'Mjesečna pretplata.', true),
(2, 'Održavanje lifta', 30.0, 'Trošak održavanja zgrade.', false);

-- RESERVATION TYPES
insert into reservation_type values
(1, 'Dnevni boravak'),
(2, 'Nocenje');

-- RESERVATIONS
insert into reservation (
    ApartmentId, ReservationId, GuestFullName, GuestPhoneNumber, 
    DateTimeOfArrival, DateTimeOfDeparture, GuestNumber, Pirce, 
    Note, PersonalDocumentURL, IdTypeOfReservation, TypeId
) values
(1, 101, 'Petar Jovanovic', '+38164111222', '2025-11-05 14:00:00', '2025-11-07 10:00:00', 2, 120.0, 'Rezervisano online.', null, 1, 1),
(2, 102, 'Ana Nikolic', '+38162123456', '2025-11-06 16:00:00', '2025-11-08 11:00:00', 3, 150.0, 'Pozivom zakazano.', null, 2, 2),
(3, 103, 'Ivan Milic', '+38765111222', '2025-11-10 13:00:00', '2025-11-13 10:00:00', 4, 270.0, 'Direktna rezervacija.', null, 3, 2);