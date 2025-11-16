import React, { useState } from 'react';
import { View, ScrollView, ScrollViewProps, TouchableOpacity, Modal } from 'react-native';
import styles from './index.styles';

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

const ApartmentScreenTemplate: React.FC<ApartmentScreenTemplateProps> = ({
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
    const [isModalVisible, setModalVisible] = useState(false);

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

                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <View style={styles.fullWidthRow}>{inventoryLink}</View>
                    </TouchableOpacity>

                    <Modal
                        visible={isModalVisible}
                        transparent
                        animationType="slide"
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={{ flex: 1 }}>{inventoryModal}</View>
                    </Modal>

                    <View style={styles.saveButtonWrapper}>{saveButton}</View>

                </View>
            </ScrollView>
        </View>
    );
};

export default ApartmentScreenTemplate;
