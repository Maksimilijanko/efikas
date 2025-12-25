import { useCallback, useRef, useState } from "react";
import {
  View,
  Image,
  Modal,
  Pressable,
  Dimensions,
  findNodeHandle,
} from "react-native";

import { Label } from "@/src/components/atoms/Label/Label";
import { Icon } from "@/src/components/atoms/Icon/Icon";
import { HStack } from "@/components/ui/hstack";
import { Colors } from "@/src/styles/style";

import styles from "./index.styles";

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
  disabled?: boolean;
};

const FALLBACK_IMG = "https://picsum.photos/300/300";

const ApartmentSelectOverlay = ({ value, options, onChange, disabled = false }: Props) => {
  const anchorRef = useRef<View>(null);
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  const measureAnchor = useCallback(() => {
    const node = findNodeHandle(anchorRef.current);
    if (!node) return;

    anchorRef.current?.measureInWindow((x, y, w, h) => {
      setAnchor({ x, y, w, h });
    });
  }, []);

  const openDropdown = () => {
    if (disabled) return;
    measureAnchor();
    setOpen(true);
  };

  const closeDropdown = () => setOpen(false);

  const pick = (apt: ApartmentOption) => {
    onChange(apt);
    closeDropdown();
  };

  const { width: screenW, height: screenH } = Dimensions.get("window");

  const dropdownLeft = anchor ? Math.max(16, Math.min(anchor.x, screenW - 16 - anchor.w)) : 16;
  const dropdownTop = anchor ? anchor.y + anchor.h + 8 : 140;
  const dropdownWidth = anchor ? anchor.w : Math.min(screenW - 32, 420);

  const maxHeight = Math.min(screenH * 0.5, 360);

  return (
    <View ref={anchorRef} style={styles.wrapper} onLayout={measureAnchor}>
      <View style={[styles.card, disabled ? styles.cardDisabled : null]}>
        <Image source={{ uri: value.imageUrl || FALLBACK_IMG }} style={styles.thumb} />

        <View style={styles.textCol}>
          <Label text={value.name} size="3xl" className="font-bold" color={Colors.textPrimary} />
          <Label text={value.address} size="lg" className="font-semibold" color={Colors.tertiary} />
        </View>

        <Pressable
        onPress={openDropdown}
          disabled={disabled}
          style={({ pressed }) => [styles.caretBtn, pressed ? styles.caretBtnPressed : null]}
          hitSlop={10}
        >
          <Icon name={open ? "ChevronUp" : "ChevronDown"} size={24} color={Colors.iconMenu} />
        </Pressable>
      </View>

      <Modal visible={open} transparent animationType="fade" onRequestClose={closeDropdown}>
        <Pressable style={styles.backdrop} onPress={closeDropdown} />

        <View
          style={[
            styles.dropdown,
            {
              left: dropdownLeft,
              top: dropdownTop,
              width: dropdownWidth,
              maxHeight,
            },
          ]}
        >
          <View style={styles.sheet}>
            {options.map((apt, idx) => {
              const isActive = apt.id === value.id;
              return (
                <View key={apt.id}>
                  <Pressable
                    onPress={() => pick(apt)}
                    style={({ pressed }) => [styles.item, pressed ? styles.itemPressed : null]}
                  >
                    <HStack space="md" style={styles.row}>
                      <Image source={{ uri: apt.imageUrl || FALLBACK_IMG }} style={styles.thumbSmall} />

                      <View style={styles.itemTextCol}>
                        <Label text={apt.name} size="2xl" className="font-bold" color={Colors.textPrimary} />
                        <Label text={apt.address} size="md" className="font-semibold" color={Colors.tertiary} />
                      </View>

                      {isActive ? <Icon name="Check" size={20} color={Colors.primary} /> : <View style={{ width: 20 }} />}
                    </HStack>
                  </Pressable>

                  {idx < options.length - 1 ? <View style={styles.divider} /> : null}
                </View>
              );
            })}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ApartmentSelectOverlay;
