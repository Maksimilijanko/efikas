import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { Colors } from "@/src/styles/style";
import { useRouter } from 'expo-router';
import { Platform } from "react-native";
import { Dimensions } from 'react-native';
import { useTranslation } from "react-i18next";
import { useTheme } from '@/src/providers/ThemeProvider';

export interface StatChartProps {
  title: string;
  data: { value: number; label: string }[];
}

function getLast7MonthsData(data, monthNames) {
  const now = new Date();
  const currentMonth = now.getMonth();

  const months = [];
  for (let i = 6; i >= 0; i--) {
    let monthIndex = currentMonth - i;
    if (monthIndex < 0) monthIndex += 12;
    months.push(monthNames[monthIndex]);
  }

  const filtered = months.map(m => data.find(d => d.label === m) || { label: m, value: 0 });

  return filtered;
}


export const StatChart: React.FC<StatChartProps> = ({ title, data }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { Colors } = useTheme();

  const monthNames = t('chart.months', { returnObjects: true });
  const last7 = getLast7MonthsData(data, monthNames);

  const chartData = last7.map(item => ({
    value: item.value,
    label: item.label,
  }));

  const handlePress = () => {
    router.push('/analytics');
  };

  const screenWidth = Dimensions.get('window').width;
  const dynamicSpacing = screenWidth / (chartData.length + 1);

  return (
    // <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
    <TouchableOpacity style={[
        styles.container,
        {
          backgroundColor: Colors.background,
          ...(Platform.OS === "ios" && {
            shadowColor: Colors.shadowColor,
          })
        }
      ]} 
      onPress={handlePress} 
      activeOpacity={0.7}>
      {false && <Text style={styles.title}>{title}</Text>}

      <LineChart
        data={chartData}
        curved
        areaChart
        thickness={1.5}
        hideRules
        xAxisLabelTextStyle={{
          color: Colors.textSecondary,
          fontSize: 12,
        }}
        xAxisLabelsVerticalShift={10}
        yAxisLabelWidth={16}
        yAxisTextStyle={{ display: 'none' }}
        initialSpacing={15}
        endSpacing={15}
        spacing={dynamicSpacing}
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
    paddingVertical: 24,
    paddingHorizontal: 0,
    borderRadius: 20,
    backgroundColor: Colors.background,
    width: '100%',
    elevation: 3,
    // SHADOW
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadowColor,
        shadowOpacity: 0.05,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 4,
      },
    }),
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: "left",
    marginTop: 16,
    marginBottom: 16,
    marginLeft: 32,
    color: Colors.textPrimary,
  },
});