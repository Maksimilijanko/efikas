import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { styles } from "./index.styles";

interface Props {
    label: string;
    icon: React.ReactNode;
}

function ApartmentAttribute({ label, icon }: Props) {
    return (
        <HStack space="sm" style={styles.hstack}>
            <Box style={styles.iconBox}>
                {icon}
            </Box>

            <Text>{label}</Text>
        </HStack>
    );
}

export default ApartmentAttribute;