import { Switch } from "@/components/ui/switch";
import { Colors } from "@/src/styles/style";

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
        false: Colors.secondary, 
        true: Colors.primary
    },
    thumbColor = Colors.background,
    ios_backgroundColor = Colors.secondary,
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