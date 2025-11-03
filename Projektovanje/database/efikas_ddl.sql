drop schema if exists efikas;
create schema efikas;
use efikas;

create table user (
UserId 			int 			auto_increment 	primary key,
Name			varchar(50)		not null,
Surname 		varchar(50)		not null,
JIB				char(13)		not null,
PasswordHash	varchar(512)		not null,
Email			varchar(50)		not null
);

create table apartment (
ApartmentId		int				auto_increment	primary key,
Address			varchar(100)	not null,
NumberOfBeds	int				not null,
NumberOfRooms	int				not null,
Capacity		int				not null,
PricePerDay		double			not null,
PricePerNight	double			not null,
UserId			int				not null,
constraint FK_apartment_user
foreign key(UserId)
references user(UserId)
on update cascade on delete cascade
);

create table cash_register (
CashRegisterId		int				primary key,
CashRegisterNumber	int				not null,
SoftwareVersion		varchar(15)		not null,
UserId 				int				not null,
constraint FK_cash_register_user
foreign key (UserID)
references user(UserId)
on update cascade on delete cascade
);

create table apartment_trait (
ApartmentId		int 			not null,
TraitName		varchar(15)		not null,
TraitValue		boolean			not null,
constraint PK_apartment_trait
primary key (ApartmentId, TraitName),
constraint FK_apartment_trait_apartment
foreign key (ApartmentId)
references apartment(ApartmentId)
on update cascade on delete cascade
);

create table apartment_picture (
ApartmentId		int				not null,
PictureURL		varchar(100)	not null,
constraint PK_apartment_picture 
primary key (ApartmentId, PictureURL),
constraint FK_apartment_picture_apartment
foreign key (ApartmentId)
references apartment(ApartmentId)
on update cascade on delete cascade
);

create table apartment_task (
ApartmentId		int				not null,
Name			varchar(20)		not null,
DateTime		timestamp		not null,
Note			varchar(256),
Status			boolean			not null,
constraint PK_apartment_task
primary key (ApartmentId, Name),
constraint FK_apartment_task_apartment
foreign key (ApartmentId)
references apartment(ApartmentId)
on update cascade on delete cascade
);

create table apartment_damage (
ApartmentId		int				not null,
Name			varchar(100)	not null,
DamagePrice		double			,
Note			varchar(256)	not null,
Status			boolean			not null,
constraint PK_apartment_damage
primary key (ApartmentId, Name),
constraint FK_apartment_damage_apartment
foreign key (ApartmentId)
references apartment(ApartmentId)
on update cascade on delete cascade
);

create table apartment_expense (
ApartmentId		int				not null,
Name			varchar(100)	not null,
Amount			double			not null,
Note			varchar(256)	not null,
Status			boolean			not null,
constraint PK_apartment_expense
primary key (ApartmentId, Name),
constraint FK_apartment_expense_apartment
foreign key (ApartmentId)
references apartment(ApartmentId)
on update cascade on delete cascade
);

create table reservation_type (
TypeId			int			primary key,
TypeName		varchar(50)	not null
);

create table reservation (
ApartmentId			int				not null,
ReservationId		int				not null,
GuestFullName		varchar(100)	not null,
GuestPhoneNumber	varchar(30)		not null,
DateTimeOfArrival	timestamp		not null,
DateTimeOfDeparture	timestamp		not null,
GuestNumber			int				not null,
Pirce				double,
Note				varchar(256),
PersonalDocument	blob,
IdTypeOfReservation	int				not null,
TypeId				int				not null,
constraint PK_reservation
primary key (ReservationId),
constraint FK_reservation_apartment
foreign key (ApartmentId)
references apartment(ApartmentId)
on update cascade on delete cascade,
constraint FK_reservation_reservation_type
foreign key (TypeId)
references reservation_type(TypeId)
on update cascade on delete cascade
);












