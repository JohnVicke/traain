/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Constants from "expo-constants";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ClerkProvider } from "@clerk/clerk-expo";

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
            <Stack
              screenOptions={{
                headerStyle: {
                  backgroundColor: "#111827",
                },
              }}
            />
            <StatusBar />
          </SafeAreaProvider>
        </TRPCProvider>
      </ProtectedRouteProvider>
    </ClerkProvider>
  );
};

export default RootLayout;
