import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { styles } from "./index.styles";
import { useTheme } from '@/src/providers/ThemeProvider';

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