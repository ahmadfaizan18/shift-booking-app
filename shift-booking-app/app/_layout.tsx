import { Tabs } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { CalendarDays, BriefcaseBusiness } from "lucide-react-native";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: "#E85D75",
            tabBarInactiveTintColor: "#374151",
            tabBarActiveBackgroundColor: "transparent",
            tabBarStyle: {
              height: 70,
              paddingTop: 4,
              paddingBottom: 6,
              backgroundColor: "#FFFFFF",
              borderTopColor: "#EEF0F4",
              borderTopWidth: 1,
              elevation: 4,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
            },
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: "700",
              marginTop: 0,
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Available",
              tabBarIcon: ({ focused, color, size }) => (
                <BriefcaseBusiness color={color} size={focused ? 24 : 20} />
              ),
            }}
          />

          <Tabs.Screen
            name="my-shifts"
            options={{
              title: "My Shifts",
              tabBarIcon: ({ focused, color, size }) => (
                <CalendarDays color={color} size={focused ? 24 : 20} />
              ),
            }}
          />
        </Tabs>
      </SafeAreaView>
    </QueryClientProvider>
  );
}