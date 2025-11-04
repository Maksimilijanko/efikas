// File: src/components/AnalyticsPieChart/styles.ts

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    mainContainer: {
        minWidth: 300,
        minHeight: 300,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: '#fff',
        borderRadius: 24
    },
    pieChartHolder: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    legendContainer: {
        minHeight: 40,
        marginBottom: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center'
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    legendColorBox: {
        width: 8,
        height: 8,
        borderRadius: 4, 
        marginRight: 5
    },
    // Note: The original had legendText style, but since you are using 
    // the custom <Label /> component, this style is likely redundant 
    // unless Label internally uses it. Leaving it out for cleaner separation.
});