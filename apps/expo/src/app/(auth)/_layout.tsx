import { View } from "react-native";
import { Slot } from "expo-router";

export default function Layout() {
  return (
    <View className="bg-slate-900 p-4">
      <Slot />
    </View>
  );
}
