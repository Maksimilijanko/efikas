import React, { useState } from "react";
import { Modal, View, TouchableWithoutFeedback, ScrollView } from "react-native";
import {
  ParkingSquare,
  Tv,
  Wifi,
  Wind,
  AirVent,
  WashingMachine,
  Coffee,
  PanelsTopLeft,
} from "lucide-react-native";
import { useTheme } from "@/src/providers/ThemeProvider";
import ApartmentFeatureCard from "@/src/components/molecules/ApartmentFeatureCard/ApartmentFeatureCard";
import { BasicButton } from "@/src/components/atoms/BasicButton/BasicButton";
import ToggleButton from "@/src/components/atoms/ToggleButton/ToggleButton";
import { useStyles } from "@/src/hooks/useStyles";
import { getStyles } from "./index.styles";
import { useTranslation } from "react-i18next";

const FEATURES = [
  { key: "parking", label: "inventoryModal.features.parking", icon: ParkingSquare },
  { key: "tv", label: "inventoryModal.features.tv", icon: Tv },
  { key: "wifi", label: "inventoryModal.features.wifi", icon: Wifi },
  { key: "fen", label: "inventoryModal.features.fen", icon: AirVent },
  { key: "klima", label: "inventoryModal.features.klima", icon: Wind },
  { key: "vesMasina", label: "inventoryModal.features.vesMasina", icon: WashingMachine },
  { key: "kafa", label: "inventoryModal.features.kafa", icon: Coffee },
  { key: "balkon", label: "inventoryModal.features.balkon", icon: PanelsTopLeft },
] as const;

type FeatureKey = (typeof FEATURES)[number]["key"];
type ValuesType = Record<FeatureKey, boolean>;

export default function InventoryModal({
  visible,
  onClose,
  onSave,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (data: ValuesType) => void;
}) {
  const { Colors } = useTheme();
  const { t } = useTranslation();
  const styles = useStyles(getStyles);

  const [values, setValues] = useState<ValuesType>(() =>
    Object.fromEntries(FEATURES.map((f) => [f.key, false])) as ValuesType
  );

  const toggle = (key: FeatureKey) => {
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
                  {FEATURES.map((feature) => {
                    const IconComponent = feature.icon;
                    return (
                      <ApartmentFeatureCard
                        key={feature.key}
                        label={t(feature.label)}
                        icon={<IconComponent size={24} color={Colors.primary} />}
                        rightElement={
                          <ToggleButton
                            value={values[feature.key]}
                            onToggle={() => toggle(feature.key)}
                            size="md"
                          />
                        }
                      />
                    );
                  })}
                </ScrollView>

                <View>
                  <BasicButton
                    title={t('inventoryModal.buttons.save')}
                    onPress={() => {
                      onSave(values);
                      onClose();
                    }}
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}