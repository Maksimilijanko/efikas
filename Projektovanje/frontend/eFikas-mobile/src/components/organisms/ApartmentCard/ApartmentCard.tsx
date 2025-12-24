import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleProp,
  ViewStyle,
} from "react-native";
import { styles } from "./index.styles";
import { Icon } from "../../atoms/Icon/Icon";
import { Label } from "../../atoms/Label/Label";
import { useTheme } from "@/src/providers/ThemeProvider";
import { useTranslation } from "react-i18next";

interface ApartmentCardProps {
  name: string;
  address: string;
  imageUrl: string;
  status?: boolean;
  statusUntil?: string;
  nextGuestsDate?: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  showArrow?: boolean;
}

const ApartmentCard: React.FC<ApartmentCardProps> = ({
  name,
  address,
  imageUrl,
  status,
  statusUntil,
  nextGuestsDate,
  onPress,
  style,
  showArrow = true,
}) => {
  const imageSource = imageUrl
    ? { uri: imageUrl }
    : { uri: "https://picsum.photos/300/300" };
  const { Colors } = useTheme();
  const { t } = useTranslation();

  const statusText = status
    ? t("apartment.card.status.occupied") // "Zauzeto"
    : t("apartment.card.status.available"); // "Slobodno"
  const statusColor = status ? Colors.statusOccupied : Colors.statusAvailable;
  const showStatus = status;
  const showNextGuests = !!nextGuestsDate;

  return (
    <TouchableOpacity
      style={[
        style,
        {
          ...styles.container,
          backgroundColor: Colors.background,
          shadowColor: Colors.shadowColor,
          paddingBottom: showStatus || showNextGuests ? 10 : 12,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.mainContentWrapper}>
        <View style={styles.topRow}>
          <Image source={imageSource} style={styles.image} />
          <View style={styles.labelContainer}>
            <Label
              className="font-bold"
              size="2xl"
              text={name}
              color={Colors.textPrimary}
            />
            <Label
              className="font-semibold"
              text={address}
              color={Colors.textSecondary}
            />
          </View>
        </View>

        {(showStatus || showNextGuests) && (
          <View style={styles.statusGroup}>
            {
              <View style={[styles.statusLine, { marginTop: 10 }]}>
                <Label
                  text={t("apartment.card.status.current")}
                  color={Colors.textSecondary}
                />
                <Label text={statusText} color={statusColor} />
                {status && statusUntil && (
                  <View style={styles.statusLine}>
                    <Label
                      text={t("apartment.card.status.until")}
                      color={Colors.textSecondary}
                    />
                    <Label text={statusUntil} color={Colors.textPrimary} />
                  </View>
                )}
              </View>
            }

            {showNextGuests && (
              <View style={[styles.statusLine, { marginTop: 4 }]}>
                <Label
                  text={t("apartment.card.status.nextGuests")}
                  color={Colors.textSecondary}
                />
                <Label text={nextGuestsDate} color={Colors.textPrimary} />
              </View>
            )}
          </View>
        )}
      </View>

      {showArrow && (
        <Icon
          name="ChevronRight"
          size={28}
          color={Colors.iconMenu}
          style={styles.icon}
        />
      )}
    </TouchableOpacity>
  );
};

export default ApartmentCard;
