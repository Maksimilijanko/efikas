import { Text } from "@/components/ui/text";
import { Animated, View } from "react-native";
import { styles } from "./index.styles";

interface Props {
    label: string;
    value: number;      // e.g. 40
    maxValue: number;   // e.g. 100
    currency?: string;
    color?: string;
}

function AnalyticsBar({ label, value, maxValue, color = 'rgb(49 118 191)', currency = 'KM' }: Props) {
    const progress = Math.min(value / maxValue, 1);

    return(
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>

            <View style={styles.barContainer}>
                <View style={[styles.barBackground]}>
                <Animated.View
                    style={[
                        styles.barFill,
                        { width: `${progress * 100}%`, backgroundColor: color },
                    ]}
                />
                </View>
                <Text style={styles.valueText}>{value} {currency}</Text>
            </View>
        </View>
    );
}

export default AnalyticsBar;