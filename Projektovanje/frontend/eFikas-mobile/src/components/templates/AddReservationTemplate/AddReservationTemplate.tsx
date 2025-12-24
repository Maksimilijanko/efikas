import { ReactNode } from "react";
import { View, ScrollView, ScrollViewProps } from "react-native";
import { useStyles } from "@/src/hooks/useStyles";
import { getStyles } from "./index.styles";

export type AddReservationTemplateProps = {
  apartmentCard: ReactNode;
  guestNameField: ReactNode;
  phoneField: ReactNode;
  guestTypeRow: ReactNode;
  dailyStayToggleRow: ReactNode;
  arrivalField: ReactNode;
  departureField: ReactNode;
  guestsCounterRow: ReactNode;
  priceField: ReactNode;
  noteField: ReactNode;
  documentRow: ReactNode;
  submitButton: ReactNode;
  scrollProps?: ScrollViewProps;
};

const AddReservationTemplate: React.FC<AddReservationTemplateProps> = ({
  apartmentCard,
  guestNameField,
  phoneField,
  guestTypeRow,
  dailyStayToggleRow,
  arrivalField,
  departureField,
  guestsCounterRow,
  priceField,
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
          <View style={styles.apartmentSection}>{apartmentCard}</View>
          <View style={styles.rowTight}>{guestTypeRow}</View>
          <View style={styles.row}>{guestNameField}</View>
          <View style={styles.row}>{phoneField}</View>
          <View style={styles.rowTight}>{dailyStayToggleRow}</View>
          <View style={styles.row}>{arrivalField}</View>
          <View style={styles.row}>{departureField}</View>
          <View style={styles.rowTight}>{guestsCounterRow}</View>
          <View style={styles.rowTight}>{priceField}</View>
          <View style={styles.row}>{noteField}</View>
          <View style={styles.rowTight}>{documentRow}</View>
          <View style={styles.submitWrapper}>{submitButton}</View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AddReservationTemplate;