DROP SCHEMA IF EXISTS efikas CASCADE;

CREATE SCHEMA efikas;


-- =========================================================================
--                                   USERS
-- =========================================================================

CREATE TABLE efikas."app_user" (
    "UserId" SERIAL PRIMARY KEY,
    "Name" varchar(50) NOT NULL,
    "Surname" varchar(50) NOT NULL,
    "JIB" char(13) NOT NULL,
    "PasswordHash" varchar(512) NOT NULL,
    "Email" varchar(50) UNIQUE NOT NULL,
    "Address" varchar(50) NOT NULL
);

-- =========================================================================
--                                   USERS
-- =========================================================================


-- -------------------------------------------------------------------------


-- =========================================================================
--                                   APARTMENT
-- =========================================================================
CREATE TABLE efikas."apartment" (
    "ApartmentId" SERIAL PRIMARY KEY,
    "Name" varchar(50) NOT NULL,
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

-- =========================================================================
--                                   APARTMENT
-- =========================================================================


-- -------------------------------------------------------------------------


-- =========================================================================
--                                   CASH REGISTER
-- =========================================================================

CREATE TABLE efikas."cash_register" (
    "CashRegisterId" SERIAL PRIMARY KEY,
    "CashRegisterNumber" int NOT NULL,
    "SoftwareVersion" varchar(15) NOT NULL,
    "UserId" int NOT NULL,
    CONSTRAINT "FK_cash_register_user" FOREIGN KEY("UserId")
        REFERENCES efikas."app_user"("UserId")
        ON UPDATE CASCADE ON DELETE CASCADE
);

-- =========================================================================
--                                   CASH REGISTER
-- =========================================================================

-- -------------------------------------------------------------------------

-- =========================================================================
--                                   RESERVATION
-- =========================================================================
CREATE TABLE efikas."reservation_type" (
    "TypeId" SERIAL PRIMARY KEY,
    "TypeName" varchar(50) NOT NULL
);

CREATE TYPE person_gender AS ENUM('Male', 'Female');

CREATE TABLE IF NOT EXISTS efikas."guests_book" (
    "GuestsBookId" SERIAL PRIMARY KEY,
    "CitizenId" varchar(30) UNIQUE NOT NULL,        -- JMBG for domestic guests, issued ID by foreign state for foreigners
    "IsLocal" boolean NOT NULL,                     -- Boolean indicator attribute
    "PersonalDocumentURL" varchar(100),

    "Name" varchar(50) NOT NULL,
    "Surname" varchar(50) NOT NULL,
    "Gender" person_gender NOT NULL,
    "PhoneNumber" varchar(30) UNIQUE NOT NULL,
    "BirthDate" date NOT NULL,
    "BirthPlace" varchar(50) NOT NULL,
    "BirthMunicipality" varchar(50) NULL,           -- locals
    "BirthCountry" varchar(50) NOT NULL,    
    "Address" varchar(50) NOT NULL,
    "Citizenship" varchar(50) NULL,                 -- foreigners
    "PassportNumber" varchar(20) NULL,              -- foreigners
    "PassportIssuedDate" date NULL,                 -- foreigners
    "VisaType" varchar(20) NULL,                    -- foreigners
    "VisaNumber" varchar(20) NULL,                  -- foreigners
    "PermittedResidenceDate" date NULL,             -- foreigners
    "EntryDate" date NULL,                          -- foreigners
    "EntryPlace" varchar(20) NULL,                  -- foreigners
    "AccommodationUnitNumber" int NOT NULL,
    "AccommodationUnitFloor" int NOT NULL,
    "DateTimeOfArrival" timestamp NOT NULL,
    "DateTimeOfDeparture" timestamp NOT NULL,
    "IssuedInvoiceNumber" varchar(50) NOT NULL, 
    "Remarks" varchar(200) NULL,

    "CreatedAt" timestamp DEFAULT NOW()
);

CREATE TABLE efikas."reservation" (
    "ReservationId" SERIAL PRIMARY KEY,
    "ApartmentId" int NOT NULL,
    "GuestId" int NOT NULL,
    "GuestQuantity" int NOT NULL,
    "Price" DOUBLE PRECISION,
    "Note" varchar(256),
    "TypeId" int NOT NULL,

    CONSTRAINT "FK_reservation_guests" FOREIGN KEY ("GuestId")
        REFERENCES efikas."guests_book"("GuestsBookId")
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT "FK_reservation_apartment" FOREIGN KEY ("ApartmentId")
        REFERENCES efikas."apartment"("ApartmentId")
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT "FK_reservation_reservation_type" FOREIGN KEY ("TypeId")
        REFERENCES efikas."reservation_type"("TypeId")
        ON UPDATE CASCADE ON DELETE CASCADE
);

-- =========================================================================
--                                   RESERVATION
-- =========================================================================


-- -------------------------------------------------------------------------


-- =========================================================================
--                                   BOOKS
-- =========================================================================
CREATE TABLE IF NOT EXISTS efikas."income_book"  (
    "IncomeBookId" SERIAL PRIMARY KEY,
    "ApartmentId" int NOT NULL,

    "AccountingDate" date NOT NULL,
    "Description" varchar(100) NOT NULL,
    "ProductSaleRevenue" decimal(8, 2) NOT NULL DEFAULT 0, 
    "GoodsSaleRevenue" decimal(8, 2) NOT NULL DEFAULT 0,
    "ServiceSaleRevenue" decimal(8, 2) NOT NULL DEFAULT 0,
    "OtherRevenue" decimal(8, 2) NOT NULL DEFAULT 0, 
    "FinancialRevenue" decimal(8, 2) NOT NULL DEFAULT 0,
    "TotalRevenue" decimal(9, 2) NOT NULL DEFAULT 0,
    "VATAmmount" decimal(8, 2) NOT NULL DEFAULT 0,

    "CreatedAt" timestamp DEFAULT NOW(),

    CONSTRAINT "FK_income_book_apartment" FOREIGN KEY ("ApartmentId")
    REFERENCES efikas."apartment"("ApartmentId")
    ON UPDATE CASCADE ON DELETE CASCADE,

    CONSTRAINT total_income_check
    CHECK (
        "TotalRevenue" = 
            "ProductSaleRevenue" +
            "GoodsSaleRevenue" +
            "ServiceSaleRevenue" +
            "OtherRevenue" +
            "FinancialRevenue"
    )
);


CREATE TABLE IF NOT EXISTS efikas."expenses_book" (
    "ExpensesBookId" SERIAL PRIMARY KEY,
    "ApartmentId" int NOT NULL,

    "AccountingDate" date NOT NULL,
    "Description" varchar(100) NOT NULL,
    "GoodsPurchaseValue" decimal(8, 2) NOT NULL DEFAULT 0,
    "Materials" decimal(8, 2) NOT NULL DEFAULT 0,
    "PersonalIncome" decimal(8, 2) NOT NULL DEFAULT 0, 
    "ProductServices" decimal(8, 2) NOT NULL DEFAULT 0,
    "OtherExpenses" decimal(8, 2) NOT NULL DEFAULT 0,
    "FinancialExpenses" decimal(8, 2) NOT NULL DEFAULT 0,
    "Amortization" decimal(8, 2) NOT NULL DEFAULT 0,
    "SupplyShortage" decimal(8, 2) NOT NULL DEFAULT 0,
    "InputVAT" decimal(8, 2) NOT NULL DEFAULT 0,
    "TotalRecognizedExpenses" decimal(9, 2) NOT NULL DEFAULT 0,
    "TotalUnrecognizedExpenses" decimal(9, 2) NOT NULL DEFAULT 0,

    "CreatedAt" timestamp DEFAULT NOW(),

    CONSTRAINT "FK_expenses_book_apartment" FOREIGN KEY ("ApartmentId")
    REFERENCES efikas."apartment"("ApartmentId")
    ON UPDATE CASCADE ON DELETE CASCADE
);


-- =========================================================================
--                                   BOOKS
-- =========================================================================


-- -------------------------------------------------------------------------

select * from efikas.app_user;

select * from efikas.reservation;

select * from efikas.reservation_type;

select * from efikas.apartment;

-- update efikas.apartment set "Name" = 'Apartman srece' where apartment."ApartmentId" = 4 ;

-- INSERT INTO "efikas"."reservation" (
--     "ApartmentId", "GuestFullName", "GuestPhoneNumber",
--     "DateTimeOfArrival", "DateTimeOfDeparture", "GuestNumber", "Price",
--     "Note", "PersonalDocumentURL", "TypeId"
-- ) VALUES
--       (4, 'Ivan Milic', '+38765111222', '2025-11-10 13:00:00', '2025-11-13 10:00:00', 4, 270.0, 'Direktna rezervacija.', NULL, 2);

-- select * from efikas.apartment_trait;