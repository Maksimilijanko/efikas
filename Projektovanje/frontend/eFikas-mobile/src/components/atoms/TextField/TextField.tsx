import { Input, InputField, InputSlot } from "@/components/ui/input";
import { GestureResponderEvent, StyleProp, ViewStyle } from "react-native";
import Icon from "@/src/components/atoms/Icon/Icon"; 

interface Props {
    size?: "xl" | "lg" | "md" | "sm";
    variant?: "underlined" | "outline" | "rounded";
    type?: "text" | "password";
    placeholder?: string;
    icon?: string;
    iconLocation?: 'left' | 'right' | 'absent';
    style?: StyleProp<ViewStyle>;
    inputProps?: React.ComponentProps<typeof InputField>;
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
    iconLocation = 'absent',
    style,
    inputProps,
    isInvalid, 
    isDisabled, 
    isHovered, 
    isFocused, 
    isRequired, 
    isOutline,
    onPress
}: Props) {

    const IconElement = icon ? (
        <InputSlot className="pl-3"  >
            <Icon name={icon} />
        </InputSlot>
    ) : null;
    
    return(
        <Input
            style={style}
            size={size} 
            variant={variant} 
            isInvalid={isInvalid} 
            isDisabled={isDisabled}
            isHovered={isHovered}
            isFocused={isFocused}
            isRequired={isRequired}
        >
            {iconLocation === "left" && IconElement}
            <InputField type={type} placeholder={placeholder} {...inputProps} />
            {iconLocation === "right" && IconElement}
        </Input>
    );
}

export default TextField;