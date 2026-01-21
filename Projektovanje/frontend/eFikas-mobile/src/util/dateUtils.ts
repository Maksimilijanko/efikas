import dayjs from "dayjs";

export const calculateNights = (
  arrivalIso: string,
  departureIso: string
): number => {
  const arrival = dayjs(arrivalIso).startOf("day");
  const departure = dayjs(departureIso).startOf("day");

  return Math.max(1, departure.diff(arrival, "day"));
};
