import { View, Text, StyleSheet } from "react-native";

export default function AvailableShiftsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Shifts</Text>
      <Text>Find and book your next shift.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FC",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 10,
  },
});