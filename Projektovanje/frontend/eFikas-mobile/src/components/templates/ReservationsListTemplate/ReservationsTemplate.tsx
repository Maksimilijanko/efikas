import React from 'react';
import { View, FlatList } from 'react-native';
import styles from './index.styles';

interface ReservationsListTemplateProps {
    iconButton: React.ReactNode;
    viewType: 'calendar' | 'list';
    listItem: (item: any) => React.ReactNode;
    listData: any[];
    calendarView: React.ReactNode;
    floatingButton: React.ReactNode;
    toggleButton: React.ReactNode;
}

const ReservationsListTemplate: React.FC<ReservationsListTemplateProps> = ({
    iconButton,
    viewType,
    listItem,
    listData,
    calendarView,
    floatingButton,
    toggleButton,
}) => {
    return (
        <View style={styles.container}>

            <View style={styles.topRight}>{iconButton}</View>

            <View style={styles.mainContent}>
                {viewType === 'calendar' ? (
                    <View>{calendarView}</View>
                ) : (
                    <FlatList
                        data={listData}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item }) => React.createElement(listItem, { item })}
                        contentContainerStyle={{
                            paddingTop: 60,
                        }}

                    />
                )}
            </View>

            <View style={styles.floatingButton}>{floatingButton}</View>
            <View style={styles.bottomToggle}>{toggleButton}</View>
        </View>
    );
};

export default ReservationsListTemplate;
