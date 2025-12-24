import { View, Image, Pressable } from "react-native";
import { Label } from "@/src/components/atoms/Label/Label";
import { Icon } from "@/src/components/atoms/Icon/Icon";
import { useTheme } from "@/src/providers/ThemeProvider";
import styles from "./index.styles";

type Props = {
  name: string;
  address: string;
  imageUrl: string;
  selected?: boolean;
  onPress: () => void;
};

const ApartmentDropdownItem = ({
  name,
  address,
  imageUrl,
  selected = false,
  onPress,
}: Props) => {
  const { Colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed ? styles.pressed : null,
      ]}
    >
      <Image source={{ uri: imageUrl }} style={styles.image} />

      <View style={styles.textCol}>
        <Label
          text={name}
          size="2xl"
          className="font-semibold"
          color={Colors.textPrimary}
        />
        <Label
          text={address}
          size="md"
          color={Colors.textSecondary}
        />
      </View>

      {selected ? (
        <Icon name="Check" size={22} color={Colors.primary} />
      ) : (
        <View style={{ width: 22 }} />
      )}
    </Pressable>
  );
};

export default ApartmentDropdownItem;
