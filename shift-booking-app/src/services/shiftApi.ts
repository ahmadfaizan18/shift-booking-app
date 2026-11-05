import { api } from "./api";
import type { Shift } from "../types/shift";

export const getShifts = async (): Promise<Shift[]> => {
  const { data } = await api.get<Shift[]>("/shifts");
  return data;
};

export const getShift = async (id: string): Promise<Shift> => {
  const { data } = await api.get<Shift>(`/shifts/${id}`);
  return data;
};

export const bookShift = async (id: string): Promise<Shift> => {
  const { data } = await api.post<Shift>(`/shifts/${id}/book`);
  return data;
};

export const cancelShift = async (id: string): Promise<Shift> => {
  const { data } = await api.post<Shift>(`/shifts/${id}/cancel`);
  return data;
};