import { Text } from "react-native";
import { MotiView } from "moti";

export function Loading() {
  return (
    <MotiView
      className="relative h-24 w-24 bg-cyan-300"
      animate={{
        scale: [1, 1.5, 1.5, 1, 1],
        rotate: ["0deg", "180deg", "0deg", "-180deg", "0deg"],
        borderRadius: ["5%", "50%", "5%", "50%", "10%"],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
      }}
    >
      <Text className="absolute flex h-full w-full items-center justify-center pt-4 text-center text-lg font-bold text-slate-900">
        ||--||
      </Text>
    </MotiView>
  );
}
