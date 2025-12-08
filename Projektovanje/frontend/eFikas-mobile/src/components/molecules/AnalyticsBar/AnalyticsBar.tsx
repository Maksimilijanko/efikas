import { Text } from "@/components/ui/text";
import { Animated, View, StyleSheet } from "react-native";
import { styles } from "./index.styles";
import { useTheme } from "@/src/providers/ThemeProvider";

interface Props {
    label: string;
    value: number;      // e.g. 40
    maxValue: number;   // e.g. 100
    currency?: string;
    color?: string;
}

function AnalyticsBar({ label, value, maxValue, color, currency = 'KM' }: Props) {
    const { Colors } = useTheme();
    const barColor = color || Colors.primary;
    const styles = getStyles(Colors);

    const progress = Math.min(value / maxValue, 1);

    return(
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>

            <View style={styles.barContainer}>
                <View style={[styles.barBackground]}>
                <Animated.View
                    style={[
                        styles.barFill,
                        { width: `${progress * 100}%`, backgroundColor: barColor },
                    ]}
                />
                </View>
                <Text style={styles.valueText}>{value} {currency}</Text>
            </View>
        </View>
    );
}

const getStyles = (Colors: any) =>
  StyleSheet.create({
    container: {
      width: "100%",
    },
    label: {
      fontSize: 14,
      color: Colors.textSecondary,
      marginBottom: 4,
    },
    barContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    barBackground: {
      flex: 1,
      height: 12,
      borderRadius: 8,
      backgroundColor: Colors.tertiary,
      overflow: "hidden",
      marginRight: 8,
    },
    barFill: {
      height: "100%",
      borderRadius: 8,
    },
    valueText: {
      fontSize: 14,
      fontWeight: "500",
      color: Colors.textPrimary,
    },
  });

export default AnalyticsBar;