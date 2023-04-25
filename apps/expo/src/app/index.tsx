import React from "react";
import { SafeAreaView, Text, View } from "react-native";
import { Stack } from "expo-router";
import { SignedIn, SignedOut } from "@clerk/clerk-expo";

import { SignOutButton } from "~/components/sign-out-button";
import { Button } from "~/components/ui/button";

export default function Root() {
  return (
    <SafeAreaView className="h-full bg-slate-900">
      <Stack.Screen options={{ title: "Workout" }} />
      <Text className="mx-auto flex-1 p-8 pb-2 text-5xl font-bold text-white">
        tra<Text className="text-blue-200">ai</Text>n
      </Text>
      <SignedIn>
        <View className="p-8">
          <Button asLink href="/workout/generate">
            Generate workout
          </Button>
          <View className="my-2" />
          <SignOutButton />
        </View>
      </SignedIn>
      <SignedOut>
        <View className="p-8">
          <Button asLink href="/sign-in">
            Continue
          </Button>
        </View>
      </SignedOut>
    </SafeAreaView>
  );
}
