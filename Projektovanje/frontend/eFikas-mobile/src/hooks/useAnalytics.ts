import { useQuery } from "@tanstack/react-query";
import {
  AnalyticsData,
  AnalyticsParams,
  analyticsService,
} from "../api/services/analyticsService";

export const useAnalytics = (params: AnalyticsParams, enabled = true) => {
  return useQuery<AnalyticsData, Error>({
    queryKey: ["analytics", params.apartmentId, (params as any).startDate, (params as any).endDate],
    queryFn: () => analyticsService.getAnalytics(params),
    enabled: enabled && Boolean(params.apartmentId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
