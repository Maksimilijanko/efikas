import { Box } from "@/src/components/ui/box";
import { HStack } from "@/src/components/ui/hstack";
import { useTheme } from '@/src/providers/ThemeProvider';
import React from "react";
import { Pressable } from "react-native";
import ApartmentAttribute from "../ApartmentAttribute/ApartmentAttribute";
import { styles } from "./index.styles";

interface ApartmentFeatureCardProps {
    label: string;
    icon: React.ReactNode;
    rightElement?: React.ReactNode;
    backgroundColor?: string;
    onPress?: () => void;
}

const ApartmentFeatureCard = ({
    label,
    icon,
    rightElement,
    backgroundColor,
    onPress,
}: ApartmentFeatureCardProps) => {
    const { Colors } = useTheme();

    const bgColor = backgroundColor || Colors.background;

    return (
        <Pressable onPress={onPress}>
            <Box style={[styles.card, { backgroundColor: bgColor }]}>
                <HStack space="sm" style={styles.hstack}>
                    <ApartmentAttribute label={label} icon={icon} />
                    {rightElement && (
                        <Box style={styles.rightElement}>
                            {rightElement}
                        </Box>
                    )}
                </HStack>
            </Box>
        </Pressable>
    );
};

export default ApartmentFeatureCard;
