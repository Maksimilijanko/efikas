import { Switch } from "@/components/ui/switch";

interface Props {
    size?: 'sm' | 'md' | 'lg';
    isDisabled?: boolean;
    isInvalid?: boolean;
    isRequired?: boolean;
    isHovered?: boolean;
    value?: boolean;
    defaultValue?: boolean;
    onToggle: () => any;

    trackColor?: { false: string, true: string };
    thumbColor?: string;
    ios_backgroundColor?: string;
}

function ToggleButton({
    size = 'md',
    isDisabled = false,
    isInvalid = false,
    isRequired = false,
    isHovered = false,
    value = false,
    defaultValue = false,
    onToggle,

    // TODO: vidjeti kako rade GlueStack var boje iz config.ts!
    trackColor = { 
        false: '#d4d4d4', 
        true: '#3176bf' 
    },
    thumbColor ="#ffffff",
    ios_backgroundColor = "#d4d4d4",
}: Props) {
    return(
        <Switch
            size={size}
            isDisabled={isDisabled}
            isInvalid={isInvalid}
            isHovered={isHovered}
            value={value}
            defaultValue={defaultValue}
            onToggle={onToggle}
            
            trackColor={trackColor}
            thumbColor={thumbColor}
            ios_backgroundColor={ios_backgroundColor}
        />
    );
}

export default ToggleButton;