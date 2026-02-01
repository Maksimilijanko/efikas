import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from '@/src/components/atoms/Icon/Icon';
import { Label } from '@/src/components/atoms/Label/Label';
import { useTheme } from '@/src/providers/ThemeProvider';
import AnalyticsBar from '../../molecules/AnalyticsBar/AnalyticsBar';

interface CollapsibleSectionProps {
    title: string;
    value: number;
    maxValue: number;
    currency: string;
    color: string;
    isExpanded?: boolean;
    onToggle?: () => void;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
    title,
    value,
    maxValue,
    currency,
    color,
    isExpanded,
    onToggle,
}) => {
    const { Colors } = useTheme();

    const Wrapper = onToggle ? TouchableOpacity : View;
    const wrapperProps = onToggle ? { onPress: onToggle, activeOpacity: 0.7 } : {};

    return (
        <View style={styles.collapsibleContainer}>
            <Wrapper style={styles.collapsibleHeader} {...wrapperProps}>
                <Label
                    text={title}
                    color={Colors.textSecondary}
                    className="font-semibold"
                />
                {onToggle && (
                    <Icon
                        name="ChevronRight"
                        size={20}
                        color={Colors.textSecondary}
                        style={{
                            transform: [{ rotate: isExpanded ? '90deg' : '0deg' }],
                        }}
                    />
                )}
            </Wrapper>

            <View style={styles.barChartContainer}>
                <AnalyticsBar
                    label=""
                    value={value}
                    maxValue={maxValue}
                    currency={currency}
                    color={color}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    collapsibleContainer: {
        width: '100%',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    collapsibleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    barChartContainer: {
        width: '90%',
    },
});

export default CollapsibleSection;