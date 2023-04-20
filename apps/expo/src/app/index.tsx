import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, Stack } from "expo-router";
import { SignedIn, SignedOut } from "@clerk/clerk-expo";

import { SignOutButton } from "~/components/sign-out-button";

export default function Root() {
  return (
    <SafeAreaView className="bg-slate-900">
      <Stack.Screen options={{ title: "Workout" }} />
      <View className="h-full w-full p-4">
        <Text className="mx-auto pb-2 text-5xl font-bold text-white">
          tra<Text className="text-pink-400">ai</Text>n
        </Text>
        <SignedIn>
          <Link href="/workout/generate" asChild>
            <Pressable>
              {() => <Text className="text-white">Generate workout</Text>}
            </Pressable>
          </Link>
          <SignOutButton />
        </SignedIn>
        <SignedOut>
          <Link href="/sign-in" asChild>
            <Pressable>
              {() => <Text className="text-white">Sign in</Text>}
            </Pressable>
          </Link>
          <Link href="/sign-up" asChild>
            <Pressable>
              {() => <Text className="text-white">Sign Up</Text>}
            </Pressable>
          </Link>
        </SignedOut>
      </View>
    </SafeAreaView>
  );
}
