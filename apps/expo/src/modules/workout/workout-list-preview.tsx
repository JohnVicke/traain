import { Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { MoreVertical } from "lucide-react-native";
import { MotiView } from "moti";

import { type RouterOutputs } from "@traain/api";

import { KeyboardAvoidView } from "~/components/keyboard-avoid-view";

type WorkoutListPreviewProps = {
  workout: RouterOutputs["workout"]["generate"];
};

export function WorkoutListPreview(props: WorkoutListPreviewProps) {
  const { workout } = props;
  return (
    <KeyboardAvoidView className="h-full w-full">
      <FlashList
        data={workout.exercises}
        renderItem={({ item, index }) => (
          <ExercisePreviewCard exercise={item} delay={index * 100} />
        )}
        keyExtractor={(item) => item.name}
        estimatedItemSize={100}
      />
    </KeyboardAvoidView>
  );
}

type ExerciseCardProps = {
  delay: number;
  exercise: {
    name: string;
    sets: number;
    reps: string;
  };
};

function ExercisePreviewCard(props: ExerciseCardProps) {
  const { exercise, delay } = props;
  return (
    <MotiView
      from={{ translateX: 40, opacity: 0 }}
      animate={{ translateX: 0, opacity: 1 }}
      delay={delay}
      className="bg-slate-800 p-4"
    >
      <View className="flex flex-row justify-between">
        <Text className="text-md font-bold text-slate-50">{exercise.name}</Text>
        <MoreVertical color="white" height={16} />
      </View>
      <View className="my-3 h-px w-full bg-slate-500/50" />
      <View className="flex">
        <Text className="text-slate-300">Sets: {exercise.sets}</Text>
        <Text className="text-slate-300">Reps: {exercise.reps}</Text>
      </View>
    </MotiView>
  );
}
