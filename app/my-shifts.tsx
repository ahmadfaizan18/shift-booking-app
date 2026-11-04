import { View, Text, StyleSheet } from "react-native";

export default function MyShiftsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Shifts</Text>
      <Text>Your booked shifts will appear here.</Text>
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