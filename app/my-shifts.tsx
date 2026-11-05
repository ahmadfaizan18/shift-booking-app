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
import { useShifts, extractErrorMessage, useCancelShift } from "../src/hooks/useShift";
import { groupShiftsByDate } from "../src/utils/shiftUtils";
import { Alert } from "react-native";

export default function MyShiftsScreen() {
  const { data: shifts, isLoading, isError, error, refetch } = useShifts();
  const cancelShiftMutation = useCancelShift();
  const [cancellingShiftId, setCancellingShiftId] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  const myShifts = (shifts ?? []).filter((shift) => shift.booked);
  const groupedShifts = groupShiftsByDate(myShifts);

  const handleCancelShift = (shiftId: string) => {
    setCancellingShiftId(shiftId);
    cancelShiftMutation.mutate(shiftId, {
      onSuccess: () => {
        Alert.alert("Success", "Shift cancelled successfully.");
      },
      onError: (err) => {
        Alert.alert("Cancellation failed", extractErrorMessage(err));
      },
      onSettled: () => {
        setCancellingShiftId(null);
      },
    });
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading my shifts...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text>Failed to load my shifts.</Text>
        <Text>{extractErrorMessage(error)}</Text>
        <Pressable style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  if (myShifts.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.heading}>My Shifts</Text>
        <Text style={styles.emptyText}>No booked shifts.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { paddingTop: 16 + insets.top }]}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <Text style={styles.heading}>My Shifts</Text>

      {Object.entries(groupedShifts).map(([date, dateShifts]) => (
        <View key={date}>
          <Text style={styles.dateHeading}>{date}</Text>

          {dateShifts.map((shift) => (
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

              <Pressable
                style={styles.cancelButton}
                onPress={() => handleCancelShift(shift.id)}
                disabled={cancellingShiftId === shift.id && cancelShiftMutation.isPending}
              >
                <Text style={styles.cancelButtonText}>
                  {cancellingShiftId === shift.id && cancelShiftMutation.isPending
                    ? "Cancelling..."
                    : "Cancel"}
                </Text>
              </Pressable>
            </View>
          ))}
        </View>
      ))}
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
  emptyText: {
    fontSize: 15,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 40,
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
  cancelButton: {
    backgroundColor: "#E85D75",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 4,
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
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
});
