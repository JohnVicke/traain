import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, Stack } from "expo-router";

import { SignOutButton } from "~/components/sign-out-button";

export default function Root() {
  return (
    <SafeAreaView className="bg-[#1F104A]">
      <Stack.Screen options={{ title: "Workout" }} />
      <View className="h-full w-full p-4">
        <Text className="mx-auto pb-2 text-5xl font-bold text-white">
          tra<Text className="text-pink-400">ai</Text>n
        </Text>

        <Link href="/sign-up" asChild>
          <Pressable>
            {() => <Text className="text-white">Sign up</Text>}
          </Pressable>
        </Link>
        <Link href="/workout" asChild>
          <Pressable>
            {() => <Text className="text-white">To workout screen (auth)</Text>}
          </Pressable>
        </Link>
        <SignOutButton />
      </View>
    </SafeAreaView>
  );
}
