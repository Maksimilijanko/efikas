import { Text } from "@/components/ui/text";
import { View } from "react-native";
import { MenuItem } from "../../molecules/MenuItem/MenuItem";
import { styles } from "./index.styles";
import { MenuSectionProps } from "@/src/types/types";


export default function MenuSection({ i18nTitleKey, title, items }: MenuSectionProps) {
    return(
        <View key={i18nTitleKey}>
            <Text
                style={[
                    styles.sectionTitle,
                    // sectionIndex > 0 && styles.sectionMargin,
                ]}
            >
                {title}
            </Text>
            <View style={styles.listContainer}>
                {items.map((item, itemIndex) => (
                    <MenuItem
                        key={item.id}
                        leftIconName={item.icon}
                        text={item.text}
                        onPress={() => item.onPressMenuItem()}
                        showDivider={itemIndex < items.length - 1}
                    />
                ))}
            </View>
        </View>
    );
}
