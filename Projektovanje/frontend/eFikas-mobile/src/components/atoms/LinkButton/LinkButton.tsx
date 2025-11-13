import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { Icon } from "../Icon/Icon";

interface Props {
    label: string;
    onPress?: () => void;
    color?: string;
}

/**
 * LinkButton component
 *
 * A lightweight, tappable text button that visually resembles a hyperlink.
 *
 * The button displays a label with an optional right-pointing chevron icon
 * and provides subtle opacity feedback when pressed.
 *
 * @param {Object} props - The component props.
 * @param {string} props.label - The text label displayed on the button.
 * @param {() => void} [props.onPress] - Callback function executed when the button is pressed.
 * @param {string} [props.color='rgb(49 118 191)'] - The text and icon color (default is a link-like blue).
 * @returns {JSX.Element} A pressable link-style button with text and icon.
 *
 * @example
 * ```tsx
 * <LinkButton label="View more" onPress={() => console.log("Link pressed")} />
 * ```
 */
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