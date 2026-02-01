import React, { useEffect } from 'react';
import {
    View,
    ScrollView,
    LayoutAnimation,
    Platform,
    UIManager
} from 'react-native';
import styles from './index.styles';
import { Colors } from '@/src/styles/style';

export type AnalyticsTemplateProps = {
    apartmentCard: React.ReactNode;
    analyticsHeader: React.ReactNode;
    summaryItems: React.ReactNode[];
    detailsContent: React.ReactNode;
    isDetailsMode: boolean;
};

/*
WARN  setLayoutAnimationEnabledExperimental is currently a no-op in the New Architecture.
Valjda ne treba navoditi u novoj arhitekturi React Native-a?
*/
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const AnalyticsTemplate: React.FC<AnalyticsTemplateProps> = ({
    apartmentCard,
    analyticsHeader,
    summaryItems,
    detailsContent,
    isDetailsMode
}) => {
    useEffect(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }, [isDetailsMode]);

    return (
        <View style={styles.root}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.inner}>
                    <View style={styles.apartmentCardWrapper}>{apartmentCard}</View>

                    <View style={styles.analyticsSection}>
                        <View style={styles.analyticsHeaderWrapper}>
                            {analyticsHeader}
                        </View>

                        <View style={styles.analyticsContentWrapper}>
                            {isDetailsMode ? (
                                <View style={styles.detailsWrapper}>{detailsContent}</View>
                            ) : (
                                summaryItems.map((item, index) => (
                                    <View key={index} style={styles.summaryItem}>
                                        {item}
                                    </View>
                                ))
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default AnalyticsTemplate;
