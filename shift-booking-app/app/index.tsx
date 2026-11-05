import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
  StyleSheet,
} from "react-native";
import { useShifts, extractErrorMessage, useBookShift } from "../src/hooks/useShift";
import { useShiftStore } from "../src/store/useShiftStore";
import {
  filterShiftsByCity,
  filterUpcomingShifts,
  filterOutBookedShifts,
  groupShiftsByDate,
  isOverlappingShift,
} from "../src/utils/shiftUtils";
import { Alert } from "react-native";

export default function AvailableShiftsScreen() {
  const { data: shifts, isLoading, isError, error, refetch } = useShifts();
  const selectedCity = useShiftStore((state) => state.selectedCity);
  const setSelectedCity = useShiftStore((state) => state.setSelectedCity);

  const bookShiftMutation = useBookShift();
  const [bookingShiftId, setBookingShiftId] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  const allShifts = shifts ?? [];
  const upcomingShifts = filterUpcomingShifts(allShifts);
  const bookedShifts = allShifts.filter((shift) => shift.booked);
  const availableShifts = filterOutBookedShifts(upcomingShifts);
  const cityFilteredShifts = filterShiftsByCity(availableShifts, selectedCity);
  const groupedShifts = groupShiftsByDate(cityFilteredShifts);

  const handleBookShift = (shiftId: string) => {
    setBookingShiftId(shiftId);
    bookShiftMutation.mutate(shiftId, {
      onSuccess: () => {
        Alert.alert("Success", "Shift booked successfully.");
      },
      onError: (err) => {
        Alert.alert("Booking failed", extractErrorMessage(err));
      },
      onSettled: () => {
        setBookingShiftId(null);
      },
    });
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading shifts...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text>Failed to load shifts.</Text>
        <Text>{extractErrorMessage(error)}</Text>
        <Pressable style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { paddingTop: 16 + insets.top }]}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <Text style={styles.heading}>Available Shifts</Text>
      <Text style={styles.subtitle}>
        {cityFilteredShifts.length} shifts available
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
      >
        {(["All", "Helsinki", "Tampere", "Turku"] as const).map((city) => (
          <Text
            key={city}
            onPress={() => setSelectedCity(city)}
            style={[styles.filter, selectedCity === city && styles.activeFilter, selectedCity === city && styles.activeFilterText]}
          >
            {city}
          </Text>
        ))}
      </ScrollView>

      {Object.entries(groupedShifts).map(([date, dateShifts]) => (
        <View key={date}>
          <Text style={styles.dateHeading}>{date}</Text>

          {dateShifts.map((shift) => {
            const isOverlapping = isOverlappingShift(shift, bookedShifts);
            const isBooking = bookingShiftId === shift.id && bookShiftMutation.isPending;
            const isDisabled = isBooking || isOverlapping;

            return (
              <View key={shift.id} style={styles.card}>
                <Text style={styles.city}>{shift.area}</Text>

                <Text style={styles.timeText}>
                  {new Date(shift.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {" - "}
                  {new Date(shift.endTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>

                {isOverlapping ? (
                  <Text style={styles.overlapText}>
                    Overlaps with an existing booking
                  </Text>
                ) : (
                  <Pressable
                    style={styles.bookButton}
                    onPress={() => handleBookShift(shift.id)}
                    disabled={isDisabled}
                  >
                    <Text style={styles.bookButtonText}>
                      {isBooking ? "Booking..." : "Book Shift"}
                    </Text>
                  </Pressable>
                )}
              </View>
            );
          })}
        </View>
      ))}

      {cityFilteredShifts.length === 0 && (
        <Text style={styles.emptyText}>No upcoming shifts found.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: "#F8F9FC",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  heading: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1A1A2E",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 24,
  },
  filterContainer: {
    marginBottom: 24,
  },

  filter: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginRight: 10,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EEF0F4",
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "600",
    minWidth: 64,
    alignItems: "center",
    overflow: "hidden",
  },

  activeFilter: {
    backgroundColor: "#E85D75",
    borderColor: "#E85D75",
  },

  activeFilterText: {
    color: "#FFFFFF",
  },

  dateHeading: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    marginTop: 20,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  emptyText: {
    fontSize: 15,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 40,
  },

  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#E85D75",
    borderRadius: 10,
    marginTop: 16,
    alignItems: "center",
  },

  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EEF0F4",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  city: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A2E",
    marginBottom: 4,
  },

  timeText: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 12,
  },

  bookButton: {
    backgroundColor: "#E85D75",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 4,
  },

  bookButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  overlapText: {
    fontSize: 12,
    color: "#E85D75",
    marginTop: 4,
    textAlign: "center",
    fontWeight: "600",
  },
});
