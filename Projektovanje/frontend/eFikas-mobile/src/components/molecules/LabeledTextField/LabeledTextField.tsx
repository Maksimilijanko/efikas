import React from "react";
import { View } from "react-native";
import { Label } from "@/src/components/atoms/Label/Label";
import TextField from "@/src/components/atoms/TextField/TextField";
import { LucideIconName } from "@/src/types/types";

interface LabeledTextFieldProps {
  label: string;
  required?: boolean;
  error?: boolean;              // dodato
  errorText?: string;           // dodato
  disabled?: boolean;
  placeholder?: string;
  size?: "sm" | "md" | "lg" | "xl";
  labelSize?:
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl";
  iconName?: LucideIconName;
  iconLocation?: "left" | "right";
  variant?: "outline" | "underlined" | "rounded";
  type?: "text" | "password";
  onPress?: (e: any) => void;

  value?: string;
  onChangeText?: (text: string) => void;
  inputProps?: any;
}

const LabeledTextField = ({
  label,
  required = false,
  error = false,
  errorText,
  disabled = false,
  placeholder = "",
  size = "md",
  labelSize = "md",
  iconName,
  iconLocation = "left",
  variant = "outline",
  type = "text",
  onPress,
  value,
  onChangeText,
  inputProps,
}: LabeledTextFieldProps) => {
  const hasError = !!error || !!errorText;

  return (
    <View className="w-full">
      <Label
        text={`${label}${required ? " *" : ""}`}
        size={labelSize}
        align="left"
        color={hasError ? "#DC2626" : undefined}
        className="mb-1"
      />

      <TextField
        placeholder={placeholder}
        size={size}
        variant={variant}
        type={type}
        iconName={iconName}
        iconLocation={iconLocation}
        isInvalid={hasError}
        isDisabled={disabled}
        onPress={onPress}
        inputProps={{
          value,
          onChangeText,
          ...(inputProps || {}),
        }}
      />

      {errorText ? (
        <Label
          text={errorText}
          size="xs"
          align="left"
          color="#DC2626"
          className="mt-1"
        />
      ) : null}
    </View>
  );
};

export default LabeledTextField;
