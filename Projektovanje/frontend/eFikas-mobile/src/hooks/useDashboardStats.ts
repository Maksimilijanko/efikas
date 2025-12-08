import { useQuery } from "@tanstack/react-query";
import { statisticsService } from "@/src/api/services/statisticsService";
import { StatisticsResponse } from "@/src/types/types";
import { toastService } from "@/src/services/toastService";
import { useTranslation } from "react-i18next";

export const useDashboardStats = () => {
  const { t } = useTranslation();

  return useQuery<StatisticsResponse, Error>({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      try {
        return await statisticsService.getStatistics();
      } catch (err: any) {
        toastService.error(
          t("dashboard.toastMessages.statsErrorTitle"),
          t("dashboard.toastMessages.statsErrorMessage")
        );
        throw err;
      }
    },
  });
};
