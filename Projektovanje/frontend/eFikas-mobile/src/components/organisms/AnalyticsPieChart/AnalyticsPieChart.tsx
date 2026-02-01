import React from 'react';
import { View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { Text as SvgText, G } from 'react-native-svg';
import { Label } from '../../atoms/Label/Label';
import { styles } from './index.styles';
import { ViewStyle } from '@expo/html-elements/build/primitives/View';
import { Colors } from '@/src/styles/style';

interface PieChartDataItem {
    key: string;
    value: number;
    color: string;
    text: string;
}

interface AnalyticsPieChartProps {
    width: ViewStyle["width"];
    data?: Array<{
        value: number;
        label: string;
        color: string;
    }>;
}

// --- Default Dummy Data ---
const defaultData: PieChartDataItem[] = [
    { key: 'Režije', value: 41.67, color: '#4285F4', text: '41.67%' },
    { key: 'Šteta', value: 25.83, color: '#F59A3D', text: '25.83%' },
    { key: 'Čišćenje', value: 11.67, color: '#3367D6', text: '11.67%' },
    { key: 'Namirnice', value: 20.83, color: '#FADB4A', text: '20.83%' },
];

// --- Percentage Label Component ---
const ExternalLabelComponent = (item: any) => (
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
        {data.map((item, index) => (
            <View
                key={`${item.key}-${index}`} // ✅ unique & stable enough
                style={styles.legendItem}
            >
                <View
                    style={[styles.legendColorBox, { backgroundColor: item.color }]}
                />
                <Label
                    color={Colors.textSecondary}
                    size="sm"
                    text={item.key}
                />
            </View>
        ))}
    </View>
);

// --- Main Pie Chart Component ---
const AnalyticsPieChart: React.FC<AnalyticsPieChartProps> = ({ width, data: propData }) => {
    // Transform incoming data to the format expected by the chart
    const chartData: PieChartDataItem[] = propData
        ? (() => {
            const total = propData.reduce((sum, d) => sum + d.value, 0);

            return propData.map((item) => ({
                key: item.label,
                value: item.value,
                color: item.color,
                text: total > 0 ? `${((item.value / total) * 100).toFixed(2)}%` : "0.00%",
            }));
        })()
        : defaultData;


    return (
        <View style={[{ width: width }, styles.mainContainer]}>
            <View style={styles.pieChartHolder}>
                <PieChart
                    data={chartData}
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
            <LegendComponent data={chartData} />
        </View>
    );
};

export default AnalyticsPieChart;