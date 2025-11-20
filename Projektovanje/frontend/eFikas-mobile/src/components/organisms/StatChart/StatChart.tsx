import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { Colors } from "@/src/styles/style";
import { useRouter } from 'expo-router';

export interface StatChartProps {
  title: string;
  data: { value: number; label: string }[];
}

export const StatChart: React.FC<StatChartProps> = ({ title, data }) => {
  const router = useRouter();

  const chartData = data.map(item => ({
    value: item.value,
    label: '',
  }));

  const handlePress = () => {
    router.push('/analytics');
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
      <Text style={styles.title}>{title}</Text>

      <LineChart
        data={chartData}
        curved
        areaChart
        thickness={1.5}
        hideRules
        hideAxesAndRules
        initialSpacing={0}
        endSpacing={0}
        spacing={30}
        hideDataPoints={true}
        color={Colors.primary}
        startFillColor={Colors.primary}
        endFillColor={Colors.primary}
        startOpacity={0.5}
        endOpacity={0}
        yAxisThickness={0}
        xAxisThickness={0}
        backgroundColor="transparent"
        height={120}
        disableScroll={true}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderRadius: 20,
    backgroundColor: Colors.background,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: "left",
    marginTop: 16,
    marginBottom: 24,
    marginLeft: 32,
    color: Colors.textPrimary,
  },
});