import React from 'react';
import { View, ScrollView, ScrollViewProps } from 'react-native';
import { getStyles } from './index.styles';
import { useTheme } from '@/src/providers/ThemeProvider';
import { useStyles } from '@/src/hooks/useStyles';

export type ApartmentScreenTemplateProps = {
    nameEdit: React.ReactNode;
    addressEdit: React.ReactNode;
    imagePicker: React.ReactNode;
    noBedsEdit: React.ReactNode;
    noBedroomsEdit: React.ReactNode;
    apartmentCapacityEdit: React.ReactNode;
    priceSection: React.ReactNode;
    inventoryLink: React.ReactNode;
    inventoryModal: React.ReactNode;
    saveButton: React.ReactNode;
    scrollProps?: ScrollViewProps;
};

const AddApartmentTemplate: React.FC<ApartmentScreenTemplateProps> = ({
    nameEdit,
    addressEdit,
    imagePicker,
    noBedsEdit,
    noBedroomsEdit,
    apartmentCapacityEdit,
    priceSection,
    inventoryLink,
    inventoryModal,
    saveButton,
    scrollProps
}) => {

    const { Colors } = useTheme();

    const styles = useStyles(getStyles);

    return (
        <View style={styles.root}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                {...scrollProps}
            >
                <View style={styles.inner}>
                    <View style={styles.fullWidthRow}>{nameEdit}</View>
                    <View style={styles.fullWidthRow}>{addressEdit}</View>

                    <View style={styles.row}>
                        <View style={styles.leftColumn}>{imagePicker}</View>
                        <View style={styles.rightColumn}>
                            <View style={styles.formRow}>{noBedsEdit}</View>
                            <View style={styles.formRow}>{noBedroomsEdit}</View>
                            <View style={styles.formRow}>{apartmentCapacityEdit}</View>
                        </View>
                    </View>

                    <View style={styles.fullWidthRow}>{priceSection}</View>
                    
                    <View style={styles.fullWidthRow}>{inventoryLink}</View>

                    <View style={styles.saveButtonWrapper}>{saveButton}</View>
                </View>
            </ScrollView>

            {inventoryModal}
        </View>
    );
};

export default AddApartmentTemplate;