import React from "react";
import * as LucideIcons from "lucide-react-native";
import { ViewStyle, StyleProp } from "react-native";
import { Colors } from "@/src/styles/style";

interface IconProps {
  name: string;
  color?: string;
  size?: number;
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
}

export const Icon = ({
  name,
  color = Colors.tertiary,
  size = 24,
  strokeWidth = 2,
  style,
}: IconProps) => {
  const LucideIcon = (LucideIcons as any)[name];

  if (!LucideIcon) {
    console.warn(`⚠️ Icon "${name}" not found in lucide-react-native`);
    return null;
  }

  return (
    <LucideIcon
      color={color}
      size={size}
      strokeWidth={strokeWidth}
      style={style}
    />
  );
};

export default Icon;
