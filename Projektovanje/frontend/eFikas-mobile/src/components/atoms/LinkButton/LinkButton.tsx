import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { Icon } from "../Icon/Icon";

interface Props {
    label: string;
    onPress?: () => void;
    color?: string;
}

function LinkButton({ label, onPress, color = 'rgb(49 118 191)' }: Props) {
    
    return(
        <Pressable onPress={onPress} >
            {({ pressed }) => (
                <HStack style={{ alignItems: 'center' }} space="md">
                    <Text size="sm" style={{ color: color, fontWeight: 'medium', opacity: !pressed ? 1 : 0.5 }} >
                        {label}
                    </Text>
                    <Icon name="ChevronRight" size={12} color="rgb(49 118 191)" /> 
                </HStack>
            )}
        </Pressable>
    );
}

export default LinkButton;