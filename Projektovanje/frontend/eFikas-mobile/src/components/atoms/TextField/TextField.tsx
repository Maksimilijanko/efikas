import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { GestureResponderEvent } from "react-native";

interface Props {
    size?: "xl" | "lg" | "md" | "sm";
    variant?: "underlined" | "outline" | "rounded";
    type?: "text" | "password";
    placeholder: string;
    icon?: any;
    iconLocation?: 'left' | 'right'
    isInvalid?: boolean;
    isDisabled?: boolean;
    isHovered?: boolean;
    isFocused?: boolean;
    isRequired?: boolean;
    isOutline?: boolean;
    onPress?: (e: GestureResponderEvent) => void;
}

function TextField({ 
    size = "md", 
    variant = "outline", 
    type,
    placeholder,
    icon,
    iconLocation = 'left',
    isInvalid, 
    isDisabled, 
    isHovered, 
    isFocused, 
    isRequired, 
    isOutline,
    onPress
}: Props) {

    const IconElement = (
        <InputSlot className="pr-3"  >
            <InputIcon as={icon} />
        </InputSlot>
    );
    
    return(
        <Input 
            size={size} 
            variant={variant} 
            isInvalid={isInvalid} 
            isDisabled={isDisabled}
            isHovered={isHovered}
            isFocused={isFocused}
            isRequired={isRequired}
        >
            {iconLocation === "left" && IconElement}
            <InputField type={type} placeholder={placeholder} />
            {iconLocation === "right" && IconElement}
        </Input>
    );
}

export default TextField;