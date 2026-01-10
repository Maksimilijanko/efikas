import React from "react";
import DatePicker from "react-native-date-picker";
import { useTheme } from "@/src/providers/ThemeProvider";
import { useTranslation } from "react-i18next";

interface DateTimePickerProps {
  visible: boolean;
  initialValue: Date | null;
  timePicker?: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
}

const DateTimePicker = ({
  visible,
  initialValue,
  timePicker = true,
  onClose,
  onConfirm,
}: DateTimePickerProps) => {
  const { Colors, theme } = useTheme();
  const { i18n, t } = useTranslation();
  const [date, setDate] = React.useState(initialValue || new Date());

  React.useEffect(() => {
    if (visible) {
      setDate(initialValue || new Date());
    }
  }, [visible, initialValue]);

  const handleConfirm = () => {
    onConfirm(date);
    onClose();
  };

  const getDatePickerLocale = () => {
    const currentLang = i18n.language;
    
    const localeMap: Record<string, string> = {
      'sr': 'sr-Latn',
      'en': 'en',
    };

    return localeMap[currentLang] || 'en';
  };

  const getPickerTheme = () => {
    if (theme === 'dark' || theme === 'light') {
      return theme;
    }
    return 'light';
  };

  const getTitle = () => {
    if (timePicker) {
      return t("datePicker.titleDateTime");
    }
    return t("datePicker.titleDateOnly");
  };

  return (
    <DatePicker
      modal
      open={visible}
      date={date}
      onDateChange={setDate}
      mode={timePicker ? "datetime" : "date"}
      onConfirm={handleConfirm}
      onCancel={onClose}
      locale={getDatePickerLocale()}
      title={getTitle()}
      confirmText={t("datePicker.common.confirm")}
      cancelText={t("datePicker.common.cancel")}
      theme={getPickerTheme()}
    />
  );
};

export default DateTimePicker;