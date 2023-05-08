/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import Constants from "expo-constants";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ClerkProvider } from "@clerk/clerk-expo";

import "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { TRPCProvider } from "~/utils/api";
import { tokenCache } from "~/utils/token-store";
import { ProtectedRouteProvider } from "./protected-route";

const RootLayout = () => {
  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={Constants?.expoConfig?.extra?.clerk.publishableKey}
    >
      <ProtectedRouteProvider>
        <TRPCProvider>
          <SafeAreaProvider>
            <Slot />
            <StatusBar />
          </SafeAreaProvider>
        </TRPCProvider>
      </ProtectedRouteProvider>
    </ClerkProvider>
  );
};

export default RootLayout;
