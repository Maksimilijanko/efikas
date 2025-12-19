-- ============================================
-- MOCK PODACI
-- ============================================

-- USERS
INSERT INTO "efikas"."app_user" ("Name", "Surname", "JIB", "PasswordHash", "Email") VALUES
    ('Marko', 'Maksimovic', '1234567890123', 'hash1', 'marko@example.com', 'Adresa 1'),
    ('Jelena', 'Petrovic', '9876543210987', 'hash2', 'jelena@example.com', 'Adresa 2'),
    ('Nikola', 'Ilic', '5554443332221', 'hash3', 'nikola@example.com', 'Adresa 3');

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


-- GUESTS BOOK
INSERT INTO efikas."guests_book" (
    "CitizenId", "IsLocal", "PersonalDocumentURL",
    "Name", "Surname", "Gender", "PhoneNumber", "BirthDate", "BirthPlace", "BirthMunicipality", "BirthCountry", "Address",
    "Citizenship", "PassportNumber", "PassportIssuedDate", "VisaType", "VisaNumber", "PermittedResidenceDate", "EntryDate", "EntryPlace",
    "AccomodationUnitNumber", "AccomodationUnitFloor", "DateTimeOfArrival", "DateTimeOfDeparture",
    "IssuedInvoiceNumber", "Remarks"
) VALUES
-- Domestic guest 1
(
    '0101990170001', true, NULL,
    'Ivan', 'Kuruzovic', 'Male', '065/123-456', '2002-10-04', 'Banja Luka', 'Republika Srpska', 'Bosnia and Herzegovina', 'Adresa 1',
    NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
    101, 1, '2024-01-05 14:00', '2024-01-10 10:00',
    '12345678', 'Business stay'
),

-- Domestic guest 2
(
    '0202990170002', true, NULL,
    'Jovana', 'Petrovic', 'Female', '065/123-457', '1992-02-02', 'Bijeljina', 'Republika Srpska', 'Bosnia and Herzegovina', 'Adresa 2',
    NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
    102, 1, '2024-02-12 15:30', '2024-02-18 09:00',
    '5312521', 'Tourism visit'
),

-- Foreign guest
(
    'DE-PASS-778899', false, NULL,
    'Thomas', 'Muller', 'Male', '+49 1522 343333', '1985-06-15', 'Berlin', NULL, 'Germany', 'Alexanderplatz 3', 
    'Germany', 'C34X88991', '2019-05-20', 'Tourist', 'VISA-9988', '2024-04-01', '2024-03-20', 'Sarajevo Airport',
    201, 2, '2024-03-20 18:00', '2024-03-27 11:00',
    '312321321', 'First visit to Bosnia'
);


-- RESERVATIONS
INSERT INTO "efikas"."reservation" (
    "ApartmentId", "GuestId", "GuestQuantity", "Price",
    "Note", "IdTypeOfReservation", "TypeId"
) VALUES
    (1, 1, 2, 120.0, 'Rezervisano online.', 1, 1),
    (2, 2, 3, 150.0, 'Pozivom zakazano.', 2, 2),
    (3, 3, 4, 270.0, 'Direktna rezervacija.', 3, 2);


-- ======================== BOOKS ========================
-- INCOME BOOK
INSERT INTO "efikas"."income_book"(
    "ApartmentId", "AccountingDate", "Description", "ProductSaleRevenue", "GoodsSaleRevenue",
    "ServiceSaleRevenue", "OtherRevenue", "FinancialRevenue", "TotalRevenue", "VATAmmount"
) VALUES
(
    1, '2024-01-05', 'January accommodation income', 0.00, 30.00, 
    300.00, 0.00, 0.00, 330.00, 56.10
),
(
    1, '2024-02-10', 'February services and goods', 0.00, 100.00,
    200.00, 50.00, 0.00, 350.00, 59.50
),
(
    1, '2024-03-15', 'March mixed revenue', 0.00, 100.65,
    400.00, 50.00, 50.00, 600.65, 102.11
);

-- EXPENSES BOOK
INSERT INTO "efikas"."expenses_book"(
    "ApartmentId", "AccountingDate", "Description", "GoodsPurchaseValue", "Materials", "PersonalIncome", "ProductServices",
    "OtherExpenses", "FinancialExpenses", "Amortization", "SupplyShortage", "InputVAT",
    "TotalRecognizedExpenses", "TotalUnrecognizedExpenses"
) VALUES
(
    2, '2024-01-07', 'Cleaning and supplies', 200.00, 150.00, 300.00, 100.00, 
    50.00, 0.00, 80.00, 0.00, 102.00, 
    880.00, 0.00
),
(
    2, '2024-02-12', 'Maintenance work', 100.00, 200.00, 400.00, 150.00, 
    70.00, 20.00, 90.00, 0.00, 175.00, 
    1030.00, 0.00
),
(
    2, '2024-03-18', 'Utilities and amortization', 0.00, 100.00, 350.00, 0.00,
    120.00, 30.00, 150.00, 0.00, 130.00,
    880.00, 50.00
);

