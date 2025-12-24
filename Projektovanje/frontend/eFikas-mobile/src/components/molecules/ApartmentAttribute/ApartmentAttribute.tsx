import { Box } from "@/src/components/ui/box";
import { HStack } from "@/src/components/ui/hstack";
import { Text } from "@/src/components/ui/text";
import { useTheme } from '@/src/providers/ThemeProvider';
import { styles } from "./index.styles";

interface Props {
    label: string;
    icon: React.ReactNode;
}

function ApartmentAttribute({ label, icon }: Props) {
    const { Colors } = useTheme();

    return (
        <HStack space="sm" style={styles.hstack}>
            <Box style={[styles.iconBox, { 
                backgroundColor: Colors.secondary, 
                shadowColor: Colors.shadowColor 
            }]}>
                {icon}
            </Box>

            <Text>{label}</Text>
        </HStack>
    );
}

export default ApartmentAttribute;