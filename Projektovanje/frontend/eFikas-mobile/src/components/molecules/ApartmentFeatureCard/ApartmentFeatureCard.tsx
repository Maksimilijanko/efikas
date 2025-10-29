import React from "react";
import { Pressable } from "react-native";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
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
    backgroundColor = "#eaeaeaff",
    onPress,
}: ApartmentFeatureCardProps) => {
    return (
        <Pressable onPress={onPress}>
            <Box style={[styles.card,{ backgroundColor }]}>
                <HStack space="sm" style={styles.hstack}>
                    {/* Lijevi dio: ApartmentAttribute */}
                    <ApartmentAttribute label={label} icon={icon} />

                    {/* Desni dio: opcioni element */}
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
