import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#0f172a" },
        animation: "slide_from_right",
      }}
    />
  );
}
