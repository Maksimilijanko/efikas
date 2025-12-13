
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


CREATE TYPE person_gender AS ENUM('Male', 'Female');

CREATE TABLE IF NOT EXISTS efikas."domestic_guests_book" (
    "DomesticGuestsBookId" SERIAL PRIMARY KEY,
    "ApartmentId" int NOT NULL,

    "Name" varchar(50) NOT NULL,
    "Surname" varchar(50) NOT NULL,
    "Gender" person_gender NOT NULL,
    "BirthDate" date NOT NULL,
    "BirthPlace" varchar(50) NOT NULL,
    "BirthMunicipality" varchar(50) NOT NULL,
    "BirthCountry" varchar(50) NOT NULL,
    "Address" varchar(50) NOT NULL,
    "JMBG" CHAR(13) NOT NULL,
    "AccomodationUnitNumber" int NOT NULL,
    "AccomodationUnitFloor" int NOT NULL,
    "DateTimeOfArrival" timestamp NOT NULL,
    "DateTimeOfDeparture" timestamp NOT NULL,
    "IssuedInvoiceNumber" int NOT NULL, 
    "Remarks" varchar(200) NOT NULL,

    "CreatedAt" timestamp DEFAULT NOW(),

    CONSTRAINT "FK_domestic_guests_book_apartment" FOREIGN KEY ("ApartmentId")
    REFERENCES efikas."apartment"("ApartmentId")
    ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS efikas."foreign_guests_book" (
    "ForeignGuestsBookId" SERIAL PRIMARY KEY,
    "ApartmentId" int NOT NULL,

    "Name" varchar(50) NOT NULL,
    "Surname" varchar(50) NOT NULL,
    "Gender" person_gender NOT NULL,
    "BirthDate" date NOT NULL,
    "BirthPlace" varchar(50) NOT NULL,
    "BirthCountry" varchar(50) NOT NULL,
    "Address" varchar(50) NOT NULL,
    "Citizenship" varchar(50) NOT NULL,
    "PassportNumber" varchar(20) NOT NULL,
    "PassportIssuedDate" date NOT NULL,
    "VisaType" varchar(20) NOT NULL,
    "VisaNumber" varchar(20) NOT NULL,
    "EntryDate" date NOT NULL,
    "EntryPlace" varchar(20) NOT NULL,
    "AccomodationUnitNumber" int NOT NULL,
    "AccomodationUnitFloor" int NOT NULL,
    "DateTimeOfArrival" timestamp NOT NULL,
    "DateTimeOfDeparture" timestamp NOT NULL,
    "IssuedInvoiceNumber" int NOT NULL, 
    "Remarks" varchar(200) NOT NULL,

    "CreatedAt" timestamp DEFAULT NOW(),

    CONSTRAINT "FK_foreign_guests_book_apartment" FOREIGN KEY ("ApartmentId")
    REFERENCES efikas."apartment"("ApartmentId")
    ON UPDATE CASCADE ON DELETE CASCADE
);