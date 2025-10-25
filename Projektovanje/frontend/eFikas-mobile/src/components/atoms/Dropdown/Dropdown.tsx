import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from "@/components/ui/select";
import { ReactNode } from "react";
import { ChevronDownIcon } from "@/components/ui/icon";

interface Props {
    size?: 'sm' | 'md' | 'lg' | 'xl'
    variant?: 'underlined' | 'outline' | 'rounded'
    items: { id: number; label: string; value: string }[];
    placeholder?: string;
    isDisabled?: boolean;
    isInvalid?: boolean;
    isRequired?: boolean;
    isHovered?: boolean;
    isFocusVisible?: boolean;
    isFocused?: boolean;
    isReadOnly?: boolean;
    onOpen?: () => any,
    onValueChange?: () => any,
    onClose?: () => any,
}

function Dropdown({
    size = 'md',
    variant = 'outline',
    items,
    placeholder,
    isDisabled = false,
    isInvalid = false,
    isRequired = false,
    isHovered = false,
    isFocusVisible = false,
    isFocused = false,
    isReadOnly = false,
    onOpen,
    onValueChange,
    onClose,
}: Props) {
    const chevronDownIcon = ChevronDownIcon;

    return(
        <Select 
            isDisabled={isDisabled} 
            isInvalid={isInvalid} 
            isRequired={isRequired} 
            isHovered={isHovered} 
            isFocusVisible={isFocusVisible}
            isFocused={isFocused} 
            onOpen={onOpen}
            onValueChange={onValueChange}
            onClose={onClose}
        >
            <SelectTrigger>
                <SelectInput size={size} variant={variant} placeholder={placeholder} className="flex-1" />
                <SelectIcon className="mr-3" as={chevronDownIcon} />
            </SelectTrigger>

            <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                    <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    {items.map(item => {
                        <SelectItem 
                            key={item.id}
                            label={item.label}
                            value={item.value}
                        />
                    }) }
                </SelectContent>
            </SelectPortal>
        </Select>
    );
}

export default Dropdown;