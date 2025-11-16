import React from 'react';
import { ScrollView, View, ScrollViewProps } from 'react-native';
import styles from './index.styles';

export type ReservationDetailsTemplateProps = {
    headerCard: React.ReactNode;
    infoItems: React.ReactNode[];
    noteHeader: React.ReactNode;
    noteBody: React.ReactNode;
    primaryAction: React.ReactNode;
    scrollProps?: ScrollViewProps;
};

const ReservationDetailsTemplate: React.FC<ReservationDetailsTemplateProps> = ({
    headerCard,
    infoItems,
    noteHeader,
    noteBody,
    primaryAction,
    scrollProps
}) => {
    return (
        <View style={styles.root}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                {...scrollProps}
            >
                <View style={styles.section}>
                    <View style={styles.headerCardWrapper}>{headerCard}</View>
                </View>

                <View style={styles.section}>
                    <View style={styles.infoGrid}>
                        {infoItems.map((item, index) => (
                            <View key={index} style={styles.infoItem}>
                                {item}
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.noteHeaderWrapper}>{noteHeader}</View>
                    <View style={styles.noteBodyWrapper}>{noteBody}</View>
                </View>

                <View style={styles.section}>
                    <View style={styles.primaryActionWrapper}>{primaryAction}</View>
                </View>
            </ScrollView>
        </View>
    );
};

export default ReservationDetailsTemplate;
