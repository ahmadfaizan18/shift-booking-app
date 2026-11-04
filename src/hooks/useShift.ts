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

// Fetch all shifts
export const useShifts = () => {
  return useQuery({
    queryKey: shiftKeys.all,
    queryFn: getShifts,
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