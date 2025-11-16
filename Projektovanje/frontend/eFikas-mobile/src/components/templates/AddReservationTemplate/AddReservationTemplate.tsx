import React from 'react';
import { View, ScrollView, ScrollViewProps } from 'react-native';
import styles from './index.styles';

export type AddReservationTemplateProps = {
    apartmentCard: React.ReactNode;
    guestNameField: React.ReactNode;
    phoneField: React.ReactNode;
    dailyStayToggleRow: React.ReactNode;
    arrivalField: React.ReactNode;
    departureField: React.ReactNode;
    guestsCounterRow: React.ReactNode;
    priceField: React.ReactNode;
    noteField: React.ReactNode;
    documentRow: React.ReactNode;
    submitButton: React.ReactNode;
    scrollProps?: ScrollViewProps;
};

const AddReservationTemplate: React.FC<AddReservationTemplateProps> = ({
    apartmentCard,
    guestNameField,
    phoneField,
    dailyStayToggleRow,
    arrivalField,
    departureField,
    guestsCounterRow,
    priceField,
    noteField,
    documentRow,
    submitButton,
    scrollProps
}) => {
    return (
        <View style={styles.root}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                {...scrollProps}
            >
                <View style={styles.inner}>

                    <View style={styles.apartmentCardWrapper}>
                        {apartmentCard}
                    </View>

                    <View style={styles.formRow}>{guestNameField}</View>
                    <View style={styles.formRow}>{phoneField}</View>
                    <View style={styles.formRow}>{dailyStayToggleRow}</View>
                    <View style={styles.formRow}>{arrivalField}</View>
                    <View style={styles.formRow}>{departureField}</View>
                    <View style={styles.formRow}>{guestsCounterRow}</View>
                    <View style={styles.formRow}>{priceField}</View>
                    <View style={styles.formRow}>{noteField}</View>
                    <View style={styles.formRow}>{documentRow}</View>

                    <View style={styles.submitWrapper}>{submitButton}</View>
                </View>
            </ScrollView>
        </View>
    );
};

export default AddReservationTemplate;
