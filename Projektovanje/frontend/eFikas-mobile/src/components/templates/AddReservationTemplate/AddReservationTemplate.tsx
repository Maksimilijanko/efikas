import { ReactNode } from "react";
import { View, ScrollView, ScrollViewProps } from "react-native";
import { useStyles } from "@/src/hooks/useStyles";
import { getStyles } from "./index.styles";

export type AddReservationTemplateProps = {
	apartmentCard: ReactNode;
	guestTypeRow: ReactNode;
	dailyStayToggleRow: ReactNode;
	arrivalField: ReactNode;
	departureField: ReactNode;

	// Zajednicka polja za oba tipa gostiju
	guestNameField: ReactNode;
	guestSurnameField: ReactNode;
	genderField: ReactNode;
	phoneField: ReactNode;
	birthDateField: ReactNode;
	birthPlaceField: ReactNode;
	birthCountryField: ReactNode;

	// Specificna polja za domace goste
	domesticFields?: {
		birthMunicipalityField: ReactNode;
		citizenIdField: ReactNode;
	};

	// Specificna polja za strane goste
	foreignFields?: {
		citizenshipField: ReactNode;
		passportNumberField: ReactNode;
		passportIssuedDateField: ReactNode;
		entryDateField: ReactNode;
		entryPlaceField: ReactNode;
		visaTypeField?: ReactNode;
		visaNumberField?: ReactNode;
		permittedResidenceDateField?: ReactNode;
	};

	// Dodatna polja
	addressField?: ReactNode;
	accommodationUnitNumberField?: ReactNode;
	accommodationUnitFloorField?: ReactNode;

	guestsCounterRow: ReactNode;
	priceField: ReactNode;
	invoiceNumberField?: ReactNode;
	noteField: ReactNode;
	documentRow: ReactNode;
	submitButton: ReactNode;
	scrollProps?: ScrollViewProps;
};

const AddReservationTemplate: React.FC<AddReservationTemplateProps> = ({
	apartmentCard,
	guestTypeRow,
	dailyStayToggleRow,
	arrivalField,
	departureField,
	guestNameField,
	guestSurnameField,
	genderField,
	phoneField,
	birthDateField,
	birthPlaceField,
	birthCountryField,
	domesticFields,
	foreignFields,
	addressField,
	accommodationUnitNumberField,
	accommodationUnitFloorField,
	guestsCounterRow,
	priceField,
	invoiceNumberField,
	noteField,
	documentRow,
	submitButton,
	scrollProps,
}) => {
	const styles = useStyles(getStyles);

	return (
		<View style={styles.root}>
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps="handled"
				{...scrollProps}
			>
				<View style={styles.inner}>
					{/* Apartman i tip boravka */}
					<View style={styles.apartmentSection}>{apartmentCard}</View>
					<View style={styles.rowTight}>{dailyStayToggleRow}</View>

					{/* Datum dolaska i odlaska */}
					<View style={styles.row}>{arrivalField}</View>
					<View style={styles.row}>{departureField}</View>

					{/* Tip gosta */}
					<View style={styles.rowTight}>{guestTypeRow}</View>

					{/* Zajednicka polja */}
					<View style={styles.row}>{guestNameField}</View>
					<View style={styles.row}>{guestSurnameField}</View>
					<View style={styles.row}>{genderField}</View>
					<View style={styles.row}>{phoneField}</View>
					<View style={styles.row}>{birthDateField}</View>
					<View style={styles.row}>{birthPlaceField}</View>
					<View style={styles.row}>{birthCountryField}</View>

					{/* Specificna polja za DOMACE goste */}
					{domesticFields && (
						<>
							<View style={styles.row}>{domesticFields.birthMunicipalityField}</View>
							<View style={styles.row}>{domesticFields.citizenIdField}</View>
						</>
					)}

					{/* Specificna polja za STRANE goste */}
					{foreignFields && (
						<>

							<View style={styles.row}>{foreignFields.citizenshipField}</View>
							<View style={styles.row}>{foreignFields.passportNumberField}</View>
							<View style={styles.row}>{foreignFields.passportIssuedDateField}</View>
							<View style={styles.row}>{foreignFields.entryDateField}</View>
							<View style={styles.row}>{foreignFields.entryPlaceField}</View>

							{foreignFields.visaTypeField && (
								<View style={styles.row}>{foreignFields.visaTypeField}</View>
							)}
							{foreignFields.visaNumberField && (
								<View style={styles.row}>{foreignFields.visaNumberField}</View>
							)}
							{foreignFields.permittedResidenceDateField && (
								<View style={styles.row}>{foreignFields.permittedResidenceDateField}</View>
							)}
						</>
					)}

					{/* Dodatna polja */}
					{addressField && <View style={styles.row}>{addressField}</View>}
					{accommodationUnitNumberField && (
						<View style={styles.row}>{accommodationUnitNumberField}</View>
					)}
					{accommodationUnitFloorField && (
						<View style={styles.row}>{accommodationUnitFloorField}</View>
					)}

					{/* Ostala polja */}
					<View style={styles.rowTight}>{guestsCounterRow}</View>
					<View style={styles.rowTight}>{priceField}</View>
					{invoiceNumberField && (
						<View style={styles.row}>{invoiceNumberField}</View>
					)}
					<View style={styles.row}>{noteField}</View>
					<View style={styles.rowTight}>{documentRow}</View>

					<View style={styles.submitWrapper}>{submitButton}</View>
				</View>
			</ScrollView>
		</View>
	);
};

export default AddReservationTemplate;
