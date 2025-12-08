import React, { useState } from "react";
import { Modal, View, TouchableWithoutFeedback, ScrollView } from "react-native";
import { ParkingSquare, Tv, Wifi, Wind, AirVent, WashingMachine, Coffee, PanelsTopLeft } from "lucide-react-native";
import { useTheme } from "@/src/providers/ThemeProvider";
import { styles } from "./index.styles";
import ApartmentFeatureCard from "@/src/components/molecules/ApartmentFeatureCard/ApartmentFeatureCard";
import { BasicButton } from "@/src/components/atoms/BasicButton/BasicButton";
import ToggleButton from "@/src/components/atoms/ToggleButton/ToggleButton"; // ✅ Dodaj import (prilagodi putanju)

export default function InventoryModal({
    visible,
    onClose,
    onSave,
}: {
    visible: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
}) {
    const { Colors } = useTheme();

    const [values, setValues] = useState({
        parking: false,
        tv: false,
        wifi: false,
        fen: false,
        klima: false,
        vesMasina: false,
        kafa: false,
        balkon: false,
    });

    const toggle = (key: keyof typeof values) => {
        setValues((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
            statusBarTranslucent={true}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.backdrop}>
                    <TouchableWithoutFeedback onPress={() => {}}>
                        <View style={styles.centerContainer}>
                            <View style={styles.modalBox}>
                                
                                <ScrollView 
                                    style={styles.scrollStyle} 
                                    showsVerticalScrollIndicator={false} 
                                    contentContainerStyle={{ flexGrow: 1 }}
                                >
                                    
                                    <ApartmentFeatureCard
                                        label="Parking"
                                        icon={<ParkingSquare size={24} color={Colors.primary} />}
                                        rightElement={
                                            <ToggleButton 
                                                value={values.parking} 
                                                onToggle={() => toggle("parking")}
                                                size="md"
                                            />
                                        }
                                    />

                                    <ApartmentFeatureCard
                                        label="TV"
                                        icon={<Tv size={24} color={Colors.primary} />}
                                        rightElement={
                                            <ToggleButton 
                                                value={values.tv} 
                                                onToggle={() => toggle("tv")}
                                                size="md"
                                            />
                                        }
                                    />

                                    <ApartmentFeatureCard
                                        label="Wi-Fi"
                                        icon={<Wifi size={24} color={Colors.primary} />}
                                        rightElement={
                                            <ToggleButton 
                                                value={values.wifi} 
                                                onToggle={() => toggle("wifi")}
                                                size="md"
                                            />
                                        }
                                    />

                                    <ApartmentFeatureCard
                                        label="Fen"
                                        icon={<AirVent size={24} color={Colors.primary} />}
                                        rightElement={
                                            <ToggleButton 
                                                value={values.fen} 
                                                onToggle={() => toggle("fen")}
                                                size="md"
                                            />
                                        }
                                    />

                                    <ApartmentFeatureCard
                                        label="Klima"
                                        icon={<Wind size={24} color={Colors.primary} />}
                                        rightElement={
                                            <ToggleButton 
                                                value={values.klima} 
                                                onToggle={() => toggle("klima")}
                                                size="md"
                                            />
                                        }
                                    />

                                    <ApartmentFeatureCard
                                        label="Veš mašina"
                                        icon={<WashingMachine size={24} color={Colors.primary} />}
                                        rightElement={
                                            <ToggleButton 
                                                value={values.vesMasina} 
                                                onToggle={() => toggle("vesMasina")}
                                                size="md"
                                            />
                                        }
                                    />

                                    <ApartmentFeatureCard
                                        label="Kafa"
                                        icon={<Coffee size={24} color={Colors.primary} />}
                                        rightElement={
                                            <ToggleButton 
                                                value={values.kafa} 
                                                onToggle={() => toggle("kafa")}
                                                size="md"
                                            />
                                        }
                                    />

                                    <ApartmentFeatureCard
                                        label="Balkon"
                                        icon={<PanelsTopLeft size={24} color={Colors.primary} />}
                                        rightElement={
                                            <ToggleButton 
                                                value={values.balkon} 
                                                onToggle={() => toggle("balkon")}
                                                size="md"
                                            />
                                        }
                                    />

                                </ScrollView>
                                
                                <View>
                                    <BasicButton title="Sačuvaj" onPress={() => {onSave(values); onClose();}} />
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}