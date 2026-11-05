import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getShifts,
  bookShift,
  cancelShift,
} from "../services/shiftApi";

// Query key for identifying shift data in the cache
export const shiftKeys = {
  all: ["shifts"] as const,
};

// Extract a user-friendly error message from an Axios or generic error.
export const extractErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axErr = error as {
      response?: { data?: { message?: string } };
    };
    return axErr.response?.data?.message || String(error);
  }
  return error instanceof Error ? error.message : String(error);
};

// Fetch all shifts
export const useShifts = () => {
  return useQuery({
    queryKey: shiftKeys.all,
    queryFn: getShifts,
    retry: 1,
  });
};

// Book a shift
export const useBookShift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookShift,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: shiftKeys.all,
      });
    },
  });
};

// Cancel a shift
export const useCancelShift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelShift,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: shiftKeys.all,
      });
    },
  });
};