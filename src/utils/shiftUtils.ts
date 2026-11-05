import type { Shift, City } from "../types/shift";

export const filterShiftsByCity = (
  shifts: Shift[],
  selectedCity: City | "All"
): Shift[] => {
  if (selectedCity === "All") {
    return shifts;
  }

  return shifts.filter((shift) => shift.area === selectedCity);
};

export const filterUpcomingShifts = (
  shifts: Shift[]
): Shift[] => {
  const now = Date.now();

  return shifts.filter((shift) => shift.startTime > now);
};

export const groupShiftsByDate = (
  shifts: Shift[]
): Record<string, Shift[]> => {
  return shifts.reduce((groups, shift) => {
    const date = new Date(shift.startTime).toDateString();

    if (!groups[date]) {
      groups[date] = [];
    }

    groups[date].push(shift);

    return groups;
  }, {} as Record<string, Shift[]>);
};

export const filterOutBookedShifts = (shifts: Shift[]): Shift[] => {
  return shifts.filter((shift) => !shift.booked);
};

export const isOverlappingShift = (
  shift: Shift,
  bookedShifts: Shift[]
): boolean => {
  return bookedShifts.some(
    (bookedShift) =>
      shift.startTime < bookedShift.endTime && shift.endTime > bookedShift.startTime
  );
};