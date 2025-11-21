import i18n from "@/src/i18n";
import { I18nextProvider } from "react-i18next";
import DashboardScreen from "@/src/components/screens/DashboardScreen/DashboardScreen";

export default function Index() {
  return (
    <I18nextProvider i18n={i18n}>
      <DashboardScreen />
    </I18nextProvider>
  );
}