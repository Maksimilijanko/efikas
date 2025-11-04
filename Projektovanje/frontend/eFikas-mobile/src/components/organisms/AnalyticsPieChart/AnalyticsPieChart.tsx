import React from 'react';
import { View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { Text as SvgText, G } from 'react-native-svg';
import { Label } from '../../atoms/Label/Label'; // Assuming this path is correct
import { styles } from './index.styles';
import { ViewStyle } from '@expo/html-elements/build/primitives/View';

interface PieChartDataItem {
    key: string;
    value: number;
    color: string;
    text: string;
}

interface AnalyticsPieChartProps {
    width: ViewStyle["width"]
}

// --- Dummy Data ---
const data: PieChartDataItem[] = [
    { key: 'Režije', value: 41.67, color: '#4285F4', text: '41.67%' },
    { key: 'Šteta', value: 25.83, color: '#F59A3D', text: '25.83%' },
    { key: 'Čišćenje', value: 11.67, color: '#3367D6', text: '11.67%' },
    { key: 'Namirnice', value: 20.83, color: '#FADB4A', text: '20.83%' },
];

// --- Percentage Label Component ---
const ExternalLabelComponent = (item) => (
    <G>
        <SvgText
            fontSize={12}
            fill={'black'}
            fontWeight={'normal'}
            fontFamily=''
        >
            {item.text}
        </SvgText>
    </G>
);

// --- Legend Component ---
const LegendComponent: React.FC<{ data: PieChartDataItem[] }> = ({ data }) => (
    <View style={styles.legendContainer}>
        {data.map((item) => (
            <View key={item.key} style={styles.legendItem}>
                <View style={[styles.legendColorBox, { backgroundColor: item.color }]} />
                <Label size={"sm"} text={item.key} />
            </View>
        ))}
    </View>
);


// --- Main Pie Chart Component ---
const AnalyticsPieChart: React.FC<AnalyticsPieChartProps> = ({ width }) => {
    return (
        <View style={[{ width: width }, styles.mainContainer]}>
            <View style={styles.pieChartHolder} >
                <PieChart
                    data={data}
                    radius={70}
                    donut={false}
                    extraRadius={60}
                    showExternalLabels={true}

                    labelLineConfig={{
                        length: 14,
                        labelComponentWidth: 40
                    }}
                    externalLabelComponent={ExternalLabelComponent}
                />
            </View>
            <LegendComponent data={data} />
        </View>
    );
};

export default AnalyticsPieChart;