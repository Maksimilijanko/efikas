import React from "react";
import { View } from "react-native";
import { Label } from "@/src/components/atoms/Label/Label";
import Icon from "@/src/components/atoms/Icon/Icon"; 
import TextField from "@/src/components/atoms/TextField/TextField";

interface LabeledTextFieldProps {
  label: string;
  required?: boolean;
  error?: boolean;
  disabled?: boolean;
  placeholder?: string;
  size?: "sm" | "md" | "lg" | "xl";     // za TextField
  labelSize?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl";
  iconName?: string;    // ime ikone za Icon komponentu
  iconLocation?: "left" | "right";
  variant?: "outline" | "underlined" | "rounded";
  type?: "text" | "password";
  onPress?: (e: any) => void;
}

const LabeledTextField = ({
  label,
  required = false,
  error = false,
  disabled = false,
  placeholder = "",
  size = "md",
  labelSize = "md",
  iconName,
  iconLocation = "left",
  variant = "outline",
  type = "text",
  onPress,
}: LabeledTextFieldProps) => {
  return (
    <View className="w-full">
      {/* Label iznad polja */}
      <Label
        text={label}
        required={required}
        error={error}
        disabled={disabled}
        size={labelSize}
        align="left"
      />

      {/* TextField */}
      <TextField
        placeholder={placeholder}
        size={size}
        variant={variant}
        type={type}
        icon={iconName}
        iconLocation={iconLocation}
        isInvalid={error}
        isDisabled={disabled}
        onPress={onPress}
      />
    </View>
  );
};

export default LabeledTextField;
