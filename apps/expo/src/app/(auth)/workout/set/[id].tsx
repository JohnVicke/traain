import { Text, View } from "react-native";
import { usePathname } from "expo-router";

import { Button } from "~/components/ui/button";

export default function EditSet() {
  const pathname = usePathname();
  return (
    <View className="h-full">
      <Text>{pathname}</Text>
      <Button asLink href="/">
        Home
      </Button>
    </View>
  );
}
