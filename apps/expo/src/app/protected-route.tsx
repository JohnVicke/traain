import React from "react";
import { useRouter, useSegments } from "expo-router";
import { useSession } from "@clerk/clerk-expo";

export function useProtectedRoute() {
  const session = useSession();
  const segments = useSegments();
  const router = useRouter();
  React.useEffect(() => {
    if (session.isLoaded) {
      const authGroup = segments[0] === "(auth)";

      if (!session.isSignedIn && authGroup) {
        router.replace("/sign-in");
      }
    }
  }, [session, segments, router]);
}

const ProtectedRouteContext = React.createContext(null);

export function ProtectedRouteProvider({ children }: React.PropsWithChildren) {
  useProtectedRoute();
  return (
    <ProtectedRouteContext.Provider value={null}>
      {children}
    </ProtectedRouteContext.Provider>
  );
}
