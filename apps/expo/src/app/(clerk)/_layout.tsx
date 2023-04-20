import { SafeAreaView } from "react-native";
import { Slot } from "expo-router";

import { KeyboardAvoidView } from "~/components/keyboard-avoid-view";

export default function Layout() {
  return (
    <SafeAreaView className="bg-slate-900">
      <KeyboardAvoidView className="h-full w-full justify-center px-4 py-8">
        <Slot />
      </KeyboardAvoidView>
    </SafeAreaView>
  );
}
