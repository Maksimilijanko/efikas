import { useMemo, useState } from "react";
import { View, Image, Pressable } from "react-native";
import { HStack } from "@/src/components/ui/hstack";
import { Label } from "@/src/components/atoms/Label/Label";
import { Icon } from "@/src/components/atoms/Icon/Icon";
import { useStyles } from "@/src/hooks/useStyles";
import { getStyles } from "./index.style";
import { useTheme } from "@/src/providers/ThemeProvider";

export type ApartmentOption = {
  id: string;
  name: string;
  address: string;
  imageUrl?: string;
};

type Props = {
  value: ApartmentOption;
  options: ApartmentOption[];
  onChange: (next: ApartmentOption) => void;
};

const FALLBACK_IMG = "https://picsum.photos/300/300";

const ApartmentSelectDropdown = ({ value, options, onChange }: Props) => {
  const { Colors } = useTheme();
  const styles = useStyles(getStyles);
  const [open, setOpen] = useState(false);

  const otherOptions = useMemo(
    () => options.filter(o => o.id !== value.id),
    [options, value.id]
  );

  const toggle = () => setOpen(p => !p);

  const pick = (apt: ApartmentOption) => {
    onChange(apt);
    setOpen(false);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        {/* SELECTED ITEM */}
        <Pressable
          onPress={toggle}
          style={({ pressed }) => [
            styles.head,
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.content}>
            <HStack space="lg" style={styles.row}>
              <Image
                source={{ uri: value.imageUrl || FALLBACK_IMG }}
                style={styles.thumb}
              />

              <View style={styles.textCol}>
                <Label text={value.name} size="xl" className="font-bold" />
                <Label
                  text={value.address}
                  size="md"
                  color={Colors.textSecondary}
                />
              </View>

              <Icon
                name={open ? "ChevronUp" : "ChevronDown"}
                size={24}
                strokeWidth={2.3}
              />
            </HStack>
          </View>
        </Pressable>

        {/* DROPDOWN */}
        {open && (
          <View style={styles.dropdown}>
            {otherOptions.map((apt, idx) => (
              <View key={apt.id}>
                <Pressable
                  onPress={() => pick(apt)}
                  style={({ pressed }) => [
                    styles.item,
                    pressed && styles.pressed,
                  ]}
                >
                  <View style={styles.content}>
                    <HStack space="lg" style={styles.row}>
                      <Image
                        source={{ uri: apt.imageUrl || FALLBACK_IMG }}
                        style={styles.thumb}
                      />
                      <View style={styles.textCol}>
                        <Label
                          text={apt.name}
                          size="lg"
                          className="font-semibold"
                        />
                        <Label
                          text={apt.address}
                          size="sm" 
                          color={Colors.textSecondary}
                        />
                      </View>
                    </HStack>
                  </View>
                </Pressable>

                {idx !== otherOptions.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export default ApartmentSelectDropdown;