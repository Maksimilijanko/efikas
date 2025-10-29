import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Box } from "@/components/ui/box";
import Icon from "@/src/components/atoms/Icon/Icon";
import { Label } from "@/src/components/atoms/Label/Label";

interface IconCardProps {
  iconName: string;
  label: string;
  onPress?: () => void;
  size?: number;
  color?: string;
  strokeWidth?: number; 
  className?: string;
  labelProps?: Omit<React.ComponentProps<typeof Label>, "text">; // omogucava prosljedjivanje svih Label propova
}

export const IconCard = ({
  iconName,
  label,
  onPress,
  size = 40,
  color,
  strokeWidth = 2,
  className,
  labelProps,
}: IconCardProps) => {
  return (
    <Pressable onPress={onPress} style={styles.pressable}>
      <Box
        className={`items-center justify-center rounded-2xl p-3 bg-[rgb(var(--color-secondary-0))] shadow-sm ${className}`}
        style={styles.container}
      >
        {/* Ikona – pomjerena malo gore */}
        <Box style={styles.iconContainer}>
          <Icon name={iconName} size={size} color={color} strokeWidth={strokeWidth} />
        </Box>

        {/* Labela – moze se kontrolisati sve kroz labelProps */}
        <Label text={label} align="center" size="lg" {...labelProps} />
      </Box>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    width: 110,
    height: 110,
  },
  iconContainer: {
    marginBottom: 4,
    transform: [{ translateY: -2 }],
  },
});
