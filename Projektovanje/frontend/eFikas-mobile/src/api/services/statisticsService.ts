import axiosInstance from "@/src/api/axiosInstance";
import { StatisticsResponse } from "@/src/types/types";

// export const statisticsService = {
//   getStatistics: async (): Promise<StatisticsResponse> => {
//     const response = await axiosInstance.get("/dashboard/statistics");
//     return response.data;
//   },
// };


// MOCK PODACI
export const statisticsService = {
  getStatistics: async (): Promise<StatisticsResponse> => {
    return {
      data: [
        { label: "Jan", value: 150 },
        { label: "Feb", value: 240 },
        { label: "Mar", value: 380 },
        { label: "Apr", value: 420 },
        { label: "Maj", value: 300 },
        { label: "Jun", value: 500 },
        { label: "Jul", value: 200 },
        { label: "Avg", value: 160 },
        { label: "Sep", value: 190 },
        { label: "Okt", value: 250 },
        { label: "Nov", value: 270 },
        { label: "Dec", value: 450 },
      ],
    };
  },
};
