import { useMemo, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { Icon } from "@/src/components/atoms/Icon/Icon";
import { Label } from "@/src/components/atoms/Label/Label";
import { useTheme } from "@/src/providers/ThemeProvider";
import AnalyticsBar from "../../molecules/AnalyticsBar/AnalyticsBar";
import AnalyticsPieChart from "../../organisms/AnalyticsPieChart/AnalyticsPieChart";
import AnalyticsTemplate from "../../templates/AnalyticsTemplate/AnalyticsTemplate";
import { useTranslation } from "react-i18next";

import ApartmentSelectDropdown from "../../organisms/ApartmentSelectDropdown/ApartmentSelectDropdown";
import { ApartmentOption } from "../../organisms/ApartmentSelectOverlay/ApartmentSelectOverlay";
import { useApartmentsList } from "@/src/hooks/useApartmentsList";
import { useAnalytics } from "@/src/hooks/useAnalytics";
import CollapsibleSection from "../../organisms/CollapsibleSection/CollapsibleSection";

const AnalyticsScreen = () => {
  const { Colors } = useTheme();
  const { t } = useTranslation();

  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [selectedInterval, setSelectedInterval] = useState("monthly");
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const getDefaultDates = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { start: startOfMonth, end: endOfMonth };
  };

  const defaultDates = getDefaultDates();
  const [startDate, setStartDate] = useState<Date>(defaultDates.start);
  const [endDate, setEndDate] = useState<Date>(defaultDates.end);

  const formatDateForApi = (date: Date): string => date.toISOString().split("T")[0];

  const updateDatesForInterval = (interval: string) => {
    const now = new Date();
    let start: Date;
    let end: Date;

    switch (interval) {
      case "monthly":
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case "yearly":
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear(), 11, 31);
        break;
      default:
        return;
    }

    setStartDate(start);
    setEndDate(end);
  };

  const resetPeriodToMonthly = () => {
    setSelectedInterval("monthly");
    updateDatesForInterval("monthly");
    setIsDatePickerVisible(false);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // ✅ apartments (identično kao AddReservationScreen)
  const {
    data: apartmentsData,
    isLoading: apartmentsLoading,
    error: apartmentsError,
  } = useApartmentsList();

  const apartments = useMemo<ApartmentOption[]>(() => {
    if (!apartmentsData) return [];
    return apartmentsData.map((apt: any) => ({
      id: String(apt.apartmentId),
      name: apt.name,
      address: apt.address,
      imageUrl: apt.imageUrl,
    }));
  }, [apartmentsData]);

  const [selectedApartment, setSelectedApartment] = useState<ApartmentOption | null>(null);

  // ✅ default = prvi sa liste (isto kao AddReservation)
  useEffect(() => {
    if (apartments.length > 0 && !selectedApartment) {
      setSelectedApartment(apartments[0]);
    }
  }, [apartments, selectedApartment]);

  // ✅ Analytics hook se uvijek pozove, ali radi samo kad imamo selekciju
  const analyticsEnabled = Boolean(selectedApartment?.id);

  const queryParams = useMemo(
    () => ({
      apartmentId: selectedApartment?.id ?? "",
      startDate: formatDateForApi(startDate),
      endDate: formatDateForApi(endDate),
    }),
    [selectedApartment?.id, startDate, endDate]
  );

  const {
    data,
    isLoading: analyticsLoading,
    isError: analyticsIsError,
    error: analyticsErrorObj,
  } = useAnalytics(queryParams as any, analyticsEnabled);

  // ✅ Compute profit + category percentages IN SCREEN (service untouched)
  const computedData = useMemo(() => {
    if (!data) return null;

    const totalIncome = data.totalIncome || 0;
    const totalCosts = data.totalCosts || 0;
    const totalProfit = totalIncome - totalCosts;

    const costsByCategory = (data.costsByCategory || []).map((c: any) => ({
      ...c,
      percentage: totalCosts > 0 ? (c.amount / totalCosts) * 100 : 0,
    }));

    return {
      ...data,
      totalIncome,
      totalCosts,
      totalProfit,
      costsByCategory,
    };
  }, [data]);

  const maxValue = useMemo(() => {
    if (!computedData) return 0;
    return Math.max(computedData.totalIncome, computedData.totalCosts, computedData.totalProfit);
  }, [computedData]);

  // ====== UI gating identično AddReservationScreen ======

  if (apartmentsLoading) {
    return (
      <View style={[styles.screen, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 16, color: Colors.textSecondary }}>Učitavanje apartmana...</Text>
      </View>
    );
  }

  if (apartmentsError || apartments.length === 0) {
    return (
      <View style={[styles.screen, { justifyContent: "center", alignItems: "center", padding: 20 }]}>
        <Icon name="AlertCircle" size={48} color={Colors.error || Colors.primary} />
        <Text
          style={{
            marginTop: 16,
            color: Colors.textPrimary,
            fontSize: 16,
            textAlign: "center",
          }}
        >
          {apartmentsError ? "Greška pri učitavanju apartmana." : "Nema dostupnih apartmana."}
        </Text>
      </View>
    );
  }

  if (!selectedApartment) return null;

  const apartmentCard = (
    <View style={{ paddingHorizontal: 16, marginVertical: 4 }}>
      <ApartmentSelectDropdown
        value={selectedApartment}
        options={apartments}
        onChange={(apt) => {
          setSelectedApartment(apt);
          setExpandedSection(null);
          resetPeriodToMonthly();
        }}
      />
    </View>
  );

  const analyticsHeader = (
    <View style={{ paddingHorizontal: 16, marginBottom: 14 }}>
      <Label text={t("analytics.title")} size="lg" color={Colors.textPrimary} className="font-bold" />
    </View>
  );

  if (analyticsLoading) {
    return (
      <AnalyticsTemplate
        apartmentCard={apartmentCard}
        analyticsHeader={analyticsHeader}
        summaryItems={[
          <View key="loading" style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={{ color: Colors.textSecondary, marginTop: 12 }}>{t("analytics.loading")}</Text>
          </View>,
        ]}
        detailsContent={null}
        isDetailsMode={false}
      />
    );
  }

  if (analyticsIsError) {
    return (
      <AnalyticsTemplate
        apartmentCard={apartmentCard}
        analyticsHeader={analyticsHeader}
        summaryItems={[
          <View key="error" style={styles.errorContainer}>
            <Icon name="AlertCircle" size={48} color={Colors.error || "#ef4444"} />
            <Text style={{ color: Colors.error || "#ef4444", marginTop: 12, textAlign: "center" }}>
              {t("analytics.errorLoading")}
            </Text>
            <Text style={{ color: Colors.textSecondary, marginTop: 4, textAlign: "center" }}>
              {analyticsErrorObj?.message || t("analytics.errorRetry")}
            </Text>
          </View>,
        ]}
        detailsContent={null}
        isDetailsMode={false}
      />
    );
  }

  if (!computedData) {
    return (
      <AnalyticsTemplate
        apartmentCard={apartmentCard}
        analyticsHeader={analyticsHeader}
        summaryItems={[]}
        detailsContent={null}
        isDetailsMode={false}
      />
    );
  }

  const summaryItems =
    expandedSection !== "troskovi"
      ? [
          <CollapsibleSection
            key="prihodi"
            title={t("analytics.categories.income")}
            value={computedData.totalIncome}
            maxValue={maxValue}
            currency="KM"
            color={Colors.success || "#10b981"}
          />,
          <CollapsibleSection
            key="troskovi"
            title={t("analytics.categories.expenses")}
            value={computedData.totalCosts}
            maxValue={maxValue}
            currency="KM"
            color={Colors.error || "#ef4444"}
            isExpanded={expandedSection === "troskovi"}
            onToggle={() => toggleSection("troskovi")}
          />,
          <CollapsibleSection
            key="profit"
            title={t("analytics.categories.profit")}
            value={computedData.totalProfit}
            maxValue={maxValue}
            currency="KM"
            color={Colors.primary}
          />,
        ]
      : [];

  const categoryLabels: Record<string, string> = {
    Režije: t("analytics.categories.utilities"),
    Šteta: t("analytics.categories.damage"),
    Čišćenje: t("analytics.categories.cleaning"),
    Namirnice: t("analytics.categories.groceries"),
  };

  const detailsContent =
    expandedSection === "troskovi" ? (
      <View style={styles.detailsWrapper}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setExpandedSection(null)}
          activeOpacity={0.7}
        >
          <Icon
            name="ChevronRight"
            size={20}
            color={Colors.textSecondary}
            style={{ transform: [{ rotate: "180deg" }] }}
          />
          <Label
            text={t("analytics.categories.expenses")}
            color={Colors.textPrimary}
            className="font-semibold"
          />
        </TouchableOpacity>

        <View style={styles.barChartWrapper}>
          <AnalyticsBar
            label=""
            value={computedData.totalCosts}
            maxValue={maxValue}
            currency="KM"
            color={Colors.error || "#ef4444"}
          />
        </View>

        <View style={styles.categoryBreakdown}>
          <Label
            text={t("analytics.expenseBreakdown")}
            color={Colors.textPrimary}
            className="font-semibold"
          />
          {computedData.costsByCategory.map((category: any) => (
            <View key={category.category} style={styles.categoryItem}>
              <View style={styles.categoryInfo}>
                <Text style={{ color: Colors.textPrimary, fontSize: 14 }}>
                  {categoryLabels[category.category]}
                </Text>
                <Text style={{ color: Colors.textSecondary, fontSize: 12 }}>
                  {Number(category.percentage).toFixed(1)}%
                </Text>
              </View>
              <Text style={{ color: Colors.textPrimary, fontSize: 14, fontWeight: "600" }}>
                {category.amount} KM
              </Text>
            </View>
          ))}
        </View>

        <View>
          <AnalyticsPieChart
            width="100%"
            data={computedData.costsByCategory.map((cat: any) => ({
              value: cat.amount,
              label: categoryLabels[cat.category],
              color: getColorForCategory(cat.category),
            }))}
          />
        </View>
      </View>
    ) : null;

  return (
    <AnalyticsTemplate
      apartmentCard={apartmentCard}
      analyticsHeader={analyticsHeader}
      summaryItems={summaryItems}
      detailsContent={detailsContent}
      isDetailsMode={expandedSection === "troskovi"}
    />
  );
};

const getColorForCategory = (category: string): string => {
  const colors: Record<string, string> = {
    Režije: "#3b82f6",
    Šteta: "#ef4444",
    Ćišćenje: "#10b981",
    Namirnice: "#f59e0b",
  };
  return colors[category] || "#6b7280";
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  detailsWrapper: { width: "100%", paddingHorizontal: 16 },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
  },
  barChartWrapper: { marginBottom: 24 },
  categoryBreakdown: { marginBottom: 20 },
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  categoryInfo: { flex: 1 },
  loadingContainer: { padding: 40, alignItems: "center", justifyContent: "center" },
  errorContainer: { padding: 40, alignItems: "center", justifyContent: "center" },
});

export default AnalyticsScreen;
