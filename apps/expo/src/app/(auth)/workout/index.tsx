import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

import { SignOutButton } from "~/components/sign-out-button";

export default function Workout() {
  return (
    <SafeAreaView className="bg-[#1F104A]">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "Workout" }} />
      <View className="h-full w-full p-4">
        <Text className="mx-auto pb-2 text-5xl font-bold text-white">
          workout
        </Text>
        <SignOutButton />
      </View>
    </SafeAreaView>
  );
}
