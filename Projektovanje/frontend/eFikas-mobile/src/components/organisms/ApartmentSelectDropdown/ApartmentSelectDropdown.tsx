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
    () => options.filter((o) => o.id !== value.id),
    [options, value.id]
  );
  
  const toggle = () => setOpen((p) => !p);
  
  const pick = (apt: ApartmentOption) => {
    onChange(apt);
    setOpen(false);
  };
  
  return (
    <View style={styles.wrapper}>
      <Pressable onPress={toggle} style={({ pressed }) => [styles.head, pressed ? styles.pressed : null]}>
        <HStack space="md" style={styles.row}>
          <Image source={{ uri: value.imageUrl || FALLBACK_IMG }} style={styles.thumb} />
          <View style={styles.textCol}>
            <Label text={value.name} size="3xl" className="font-bold" color={Colors.textPrimary} />
            <Label text={value.address} size="lg" className="font-semibold" color={Colors.tertiary} />
          </View>
          <View style={styles.chevWrap}>
            <Icon
              name={open ? "ChevronUp" : "ChevronDown"}
              size={26}
              color={Colors.iconMenu}
            />
          </View>
        </HStack>
      </Pressable>
      
      {open && (
        <View style={styles.dropdown}>
          {otherOptions.map((apt, idx) => {
            const isLast = idx === otherOptions.length - 1;
            return (
              <View key={apt.id}>
                {idx === 0 && <View style={styles.divider} />}
                <Pressable
                  onPress={() => pick(apt)}
                  style={({ pressed }) => [styles.item, pressed ? styles.pressed : null]}
                >
                  <HStack space="md" style={styles.row}>
                    <Image source={{ uri: apt.imageUrl || FALLBACK_IMG }} style={styles.thumb} />
                    <View style={styles.textCol}>
                      <Label text={apt.name} size="3xl" className="font-bold" color={Colors.textPrimary} />
                      <Label text={apt.address} size="lg" className="font-semibold" color={Colors.tertiary} />
                    </View>
                  </HStack>
                </Pressable>
                {!isLast && <View style={styles.divider} />}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default ApartmentSelectDropdown;