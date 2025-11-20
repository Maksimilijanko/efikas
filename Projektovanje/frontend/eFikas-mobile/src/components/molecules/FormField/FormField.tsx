import { FormControl, FormControlHelper, FormControlHelperText, 
        FormControlError, FormControlErrorIcon, FormControlErrorText } from "@/components/ui/form-control";
import LabeledTextField from "../LabeledTextField/LabeledTextField";
import { LucideIconName } from "@/src/types/types";
import { Icon } from "../../atoms/Icon/Icon";


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

    return (
        <FormControl isInvalid={isInvalid} isRequired size="md">
            <LabeledTextField
                label={label}
                placeholder={placeholder}
                iconLocation="left"
                iconName={iconName}
                type={type}
                onChangeText={onChangeText}
            />

            {helperText && (
                <FormControlHelper>
                    <FormControlHelperText>{helperText}</FormControlHelperText>
                </FormControlHelper>
            )}

            {isInvalid && errorText && (
                <FormControlError>
                    <FormControlErrorIcon
                        
                        className="text-red-500"
                    >
                        <Icon name="OctagonAlert" />
                    </FormControlErrorIcon>
                    <FormControlErrorText className="text-red-500">
                        {errorText}
                    </FormControlErrorText>
                </FormControlError>
            )}
        </FormControl>
  );
}