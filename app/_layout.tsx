import { Tabs } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CalendarDays, BriefcaseBusiness } from "lucide-react-native";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#E85D75",
          tabBarInactiveTintColor: "#8A94A6",
          tabBarStyle: {
            height: 65,
            paddingTop: 8,
            paddingBottom: 8,
            backgroundColor: "#FFFFFF",
            borderTopColor: "#EEF0F4",
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Available",
            tabBarIcon: ({ color, size }) => (
              <BriefcaseBusiness color={color} size={size} />
            ),
          }}
        />

        <Tabs.Screen
          name="my-shifts"
          options={{
            title: "My Shifts",
            tabBarIcon: ({ color, size }) => (
              <CalendarDays color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </QueryClientProvider>
  );
}