import React, { useMemo } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { SegmentedControl } from "@/src/components/atoms/SegmentedControl/SegmentedControl";

type SegmentOption = "finished" | "active" | "upcoming";

interface Props {
  segment: SegmentOption;
  onSegmentChange: (value: SegmentOption) => void;
}

export default function ReservationSegmentedControl({ segment, onSegmentChange }: Props) {
  const { t } = useTranslation();

  const segmentOptions = useMemo(() => [
    { label: t("reservations.segments.finished"), value: "finished" },
    { label: t("reservations.segments.active"), value: "active" },
    { label: t("reservations.segments.upcoming"), value: "upcoming" }
  ], [t]);

  return (
    <View>
      <SegmentedControl
        options={segmentOptions.map(o => o.label)}
        selectedOption={segmentOptions.find(o => o.value === segment)?.label || ""}
        onOptionPress={(label) => {
          const selected = segmentOptions.find(o => o.label === label);
          if (selected) onSegmentChange(selected.value as SegmentOption);
        }}
      />
    </View>
  );
}
