import {
    FormControl,
    FormControlError, FormControlErrorIcon, FormControlErrorText,
    FormControlHelper, FormControlHelperText
} from "@/src/components/ui/form-control";
import { LucideIconName } from "@/src/types/types";
import { AlertTriangleIcon } from "lucide-react-native";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Icon } from "../../atoms/Icon/Icon";
import LabeledTextField from "../LabeledTextField/LabeledTextField";


interface Props {
  label: string;
  placeholder: string;
  iconName: LucideIconName;
  type?: "text" | "password";
  helperText?: string;
  errorText?: string;
  isInvalid?: boolean;
  onChangeText?: (text: string) => void;
}

export default function FormField({
  label,
  placeholder,
  iconName,
  type = "text",
  helperText,
  errorText,
  isInvalid = false,
  onChangeText
}: Props) {
    const [isPasswordVisible, setPasswordVisible] = useState(false);

    const isPasswordField = type === "password";

    return (
        <FormControl isInvalid={isInvalid} isRequired size="md">
            <LabeledTextField
                label={label}
                placeholder={placeholder}
                iconLocation="left"
                iconName={iconName}
                type={isPasswordField && !isPasswordVisible ? "password" : "text"}
                onChangeText={onChangeText}
                rightElement={
                    isPasswordField ? (
                        <TouchableOpacity
                            onPress={() => setPasswordVisible(v => !v)}
                            style={{ paddingRight: 8 }}
                        >
                        {isPasswordVisible ? (
                            <Icon name="Eye" size={20} />
                        ) : (
                            <Icon name="EyeOff" size={20} />
                        )}
                        </TouchableOpacity>
                    ) : null
                }
            />

            {helperText && (
                <FormControlHelper>
                    <FormControlHelperText>{helperText}</FormControlHelperText>
                </FormControlHelper>
            )}

            {isInvalid && errorText && (
                <FormControlError>
                    <FormControlErrorIcon
                        as={AlertTriangleIcon}
                        className="text-red-500"
                    >
                    </FormControlErrorIcon>
                    <FormControlErrorText className="text-red-500">
                        {errorText}
                    </FormControlErrorText>
                </FormControlError>
            )}
        </FormControl>
  );
}