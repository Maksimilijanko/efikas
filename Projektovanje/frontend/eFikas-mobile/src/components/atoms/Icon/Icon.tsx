import React from "react";
import * as LucideIcons from "lucide-react-native";
import { ViewStyle, StyleProp } from "react-native";
import { Colors } from "@/src/styles/style";
import { LucideIconName } from "@/src/types/types";

interface IconProps {
  name: LucideIconName;
  color?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export const Icon = ({
  name,
  color = Colors.tertiary,
  size = 24,
  style,
}: IconProps) => {
  const LucideIcon = (LucideIcons as any)[name];

  if (!LucideIcon) {
    console.warn(`WARNING: Icon "${name}" not found in lucide-react-native`);
    return null;
  }

  return <LucideIcon color={color} size={size} style={style} />;
};


