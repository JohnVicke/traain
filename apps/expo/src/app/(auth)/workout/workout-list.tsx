import { Text, TextInput, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { MoreVertical } from "lucide-react-native";
import { MotiView } from "moti";

import { type RouterOutputs } from "@traain/api";

import { KeyboardAvoidView } from "~/components/keyboard-avoid-view";

type WorkoutListProps = {
  workout: RouterOutputs["workout"]["create"];
};

export function WorkoutList(props: WorkoutListProps) {
  const { workout } = props;
  return (
    <KeyboardAvoidView className="h-full w-full">
      <FlashList
        data={workout.exercises}
        renderItem={({ item, index }) => (
          <ExerciseCard exercise={item} delay={index * 100} />
        )}
        keyExtractor={(item) => item.name}
        estimatedItemSize={200}
        ItemSeparatorComponent={() => <View className="h-4" />}
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

function ExerciseCard(props: ExerciseCardProps) {
  const { exercise, delay } = props;
  return (
    <MotiView
      from={{ translateY: 40, opacity: 0 }}
      animate={{ translateY: 0, opacity: 1 }}
      delay={delay}
      className="rounded-lg bg-slate-800 p-4"
    >
      <Text className="text-md font-bold text-slate-50">{exercise.name}</Text>
      <View className="my-3 h-px w-full bg-slate-500/50" />
      <View className="flex">
        {new Array(exercise.sets).fill(0).map((_, index) => (
          <SetRow key={`set-row-${exercise.name}-${index}`} index={index} />
        ))}
      </View>
    </MotiView>
  );
}

type SetRowProps = {
  index: number;
};

function SetRow(props: SetRowProps) {
  return (
    <View className="mb-2 flex flex-row items-center">
      <View className="relative h-6 w-6 items-center justify-center rounded-full bg-slate-500/50 p-2">
        <Text className="absolute text-xs text-slate-200">
          {props.index + 1}
        </Text>
      </View>
      <View className="ml-4 flex min-w-[50px]">
        <Text className="text-[10px] text-slate-400">Weight</Text>
        <TextInput
          placeholder="0"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          className="rounded p-1 font-bold text-white"
          keyboardType="number-pad"
        />
      </View>
      <View className="ml-2 flex min-w-[50px]">
        <Text className="text-[10px] text-slate-400">Reps</Text>
        <TextInput
          placeholder="0"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          className="rounded p-1 font-bold text-white"
          keyboardType="number-pad"
        />
      </View>
      <View className="ml-2 flex min-w-[50px]">
        <Text className="text-[10px] text-slate-400">Notes</Text>
        <TextInput
          placeholder="Notes..."
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          className="rounded p-1 text-white"
          keyboardType="default"
        />
      </View>
      <MoreVertical className="ml-auto" color="white" height={16} />
    </View>
  );
}
