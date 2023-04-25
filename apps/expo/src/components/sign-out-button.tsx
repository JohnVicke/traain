import { useAuth } from "@clerk/clerk-expo";

import { Button } from "./ui/button";

export function SignOutButton() {
  const { signOut } = useAuth();
  return (
    <Button variant="outline" onPress={() => void signOut()}>
      Sign Out
    </Button>
  );
}
