import React, { useRef } from 'react';
import { StyleSheet, View, Text, ViewStyle, TextStyle } from 'react-native';
import { RectButton, Swipeable } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/src/providers/ThemeProvider'; 


interface TaskDamageCostCardProps {
    apartmant: string;
    description: string;
    id: string;
    isFinished: boolean;
    onFinish: (id: string) => void;
}


interface FinishButtonProps {
    onPress: () => void;
    text: string;
}

const FinishButton: React.FC<FinishButtonProps> = ({ onPress, text }) => {
    const { Colors } = useTheme();

    return (
        <RectButton style={styles(Colors).rightAction} onPress={onPress}>
            <Text style={styles(Colors).actionText}>{text}</Text>
        </RectButton>
    );
};


const TaskDamageCostCard: React.FC<TaskDamageCostCardProps> = (props) => {
    const { t } = useTranslation();
    const { Colors } = useTheme();

    const swipeableRow = useRef<Swipeable>(null);
    const { isFinished, apartmant, description, id, onFinish } = props;

    const close = () => {
        if (swipeableRow.current) {
            swipeableRow.current.close();
        }
    };

    const handleFinish = () => {
        onFinish(id);
        close();
    };

    
    const barColor = isFinished ? Colors.successColor : Colors.deleteColor;

    const dynamicStyles = styles(Colors, barColor); 

    const renderRightActions = () => (
        <View style={dynamicStyles.rightActionContainer}>
            <FinishButton
                onPress={handleFinish}
                text={t("common.finish")}
            />
        </View>
    );

    const ContentView = () => (
        <View style={dynamicStyles.contentContainer}>
            <View style={dynamicStyles.redBar} /> 
            <View style={dynamicStyles.textContainer}>
                <Text style={dynamicStyles.primaryText}>{apartmant}</Text>
                <Text style={dynamicStyles.secondaryText}>{description}</Text>
            </View>
        </View>
    );

    return (
        <Swipeable
            ref={swipeableRow}
            friction={2}
            leftThreshold={40}
            rightThreshold={40}
            renderRightActions={!isFinished ? renderRightActions : null}
        >
            <ContentView />
        </Swipeable>
    );
}

export default TaskDamageCostCard;


const styles = (Colors: any, barColor?: string) => StyleSheet.create({
    contentContainer: {
        backgroundColor: Colors.background, 
        paddingVertical: 0,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        marginVertical: 8,
        minHeight: 80,
        paddingLeft: 21,
    } as ViewStyle,
    textContainer: {
        marginLeft: 0,
        paddingVertical: 20,
    } as ViewStyle,
    primaryText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        color: Colors.textPrimary,
    } as TextStyle,
    secondaryText: {
        fontSize: 14,
        color: Colors.textSecondary,
    } as TextStyle,
    redBar: {
        width: 6,
        height: '100%',
        position: 'absolute',
        left: 0,
        top: 0,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        backgroundColor: barColor || Colors.deleteColor, 
    } as ViewStyle,
    rightActionContainer: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        width: 100,
        marginVertical: 8,
        borderRadius: 8,
        overflow: 'hidden',
    } as ViewStyle,
    rightAction: {
        backgroundColor: Colors.successColor, 
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        borderRadius: 8,
    } as ViewStyle,
    actionText: {
        color: Colors.textLight,
        fontWeight: '600',
        padding: 10,
    } as TextStyle,
});