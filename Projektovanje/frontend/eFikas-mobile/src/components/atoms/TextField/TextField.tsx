import { Input, InputField, InputSlot } from "@/components/ui/input";
import { ReactNode } from "react";
import { GestureResponderEvent } from "react-native";

interface Props {
    size?: "xl" | "lg" | "md" | "sm";
    variant?: "underlined" | "outline" | "rounded";
    type?: "text" | "password";
    placeholder: string;
    icon?: ReactNode;
    isInvalid?: boolean;
    isDisabled?: boolean;
    isHovered?: boolean;
    isFocused?: boolean;
    isRequired?: boolean;
    isOutline?: boolean;
    onPress: (e: GestureResponderEvent) => void;
}

function TextField({ 
    size = "md", 
    variant = "outline", 
    type,
    placeholder,
    icon,
    isInvalid, 
    isDisabled, 
    isHovered, 
    isFocused, 
    isRequired, 
    isOutline,
    onPress
}: Props) {
    return(
        <Input size={size} variant={variant} isInvalid={isInvalid} >
            <InputField type={type} placeholder={placeholder} />
            <InputSlot className="pr-3" onPress={onPress}>
              {icon}
            </InputSlot>
        </Input>
    );
}

export default TextField;