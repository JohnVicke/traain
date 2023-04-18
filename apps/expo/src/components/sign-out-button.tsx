import { Text, TouchableOpacity } from "react-native";
import { useAuth } from "@clerk/clerk-expo";

export function SignOutButton() {
  const { signOut } = useAuth();
  return (
    <TouchableOpacity
      className="rounded bg-pink-400 p-2"
      onPress={() => void signOut()}
    >
      <Text className="text-center text-white">Sign Out</Text>
    </TouchableOpacity>
  );
}
