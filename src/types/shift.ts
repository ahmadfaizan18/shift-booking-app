export type City = "Helsinki" | "Tampere" | "Turku";

export interface Shift {
  id: string;
  area: City;
  booked: boolean;
  startTime: number;
  endTime: number;
}

export type ShiftAction = "book" | "cancel";