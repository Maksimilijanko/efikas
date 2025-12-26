import dayjs from "dayjs";

export const dateService = {
    formatLocalDate: (date: Date): string => {
        return dayjs(date).format('DD. MM. YYYY');
    },

    formatBackendDate: (date: Date): string => {
        return dayjs(date).format('YYYY-MM-DD');
    }
}