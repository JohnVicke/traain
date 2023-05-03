import { Text, TextInput, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Link, useRouter } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { MoreVertical } from "lucide-react-native";
import { MotiView } from "moti";

import { type RouterOutputs } from "@traain/api";

import { KeyboardAvoidView } from "~/components/keyboard-avoid-view";

type WorkoutOutput = RouterOutputs["workout"]["get"];

type WorkoutListProps = {
  workout: WorkoutOutput;
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
        keyExtractor={(exercise) => exercise.id.toString()}
        estimatedItemSize={200}
        ItemSeparatorComponent={() => <View className="h-4" />}
      />
    </KeyboardAvoidView>
  );
}

type ExerciseCardProps = {
  delay: number;
  exercise: WorkoutOutput["exercises"][number];
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
      <Text className="text-md font-bold text-slate-50">
        {exercise.exercise.name}
      </Text>
      <View className="my-3 h-px w-full bg-slate-500/50" />
      <View className="flex">
        {exercise.sets.map((set, index) => (
          <SetRow
            key={`set-${index}-row-${exercise.id}-${exercise.exercise.id}`}
            index={index}
            set={set}
          />
        ))}
      </View>
    </MotiView>
  );
}

type SetRowProps = {
  index: number;
  set: WorkoutOutput["exercises"][number]["sets"][number];
};

function SetRow(props: SetRowProps) {
  const router = useRouter();
  return (
    <TouchableOpacity
      onLongPress={() => {
        router.push(`/workout/set/${props.set.id}`);
      }}
      className="mb-2 flex flex-row items-center"
    >
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
          placeholder={props.set.notes ?? ""}
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          className="rounded p-1 text-white"
          keyboardType="default"
        />
      </View>
      <Link asChild href={`set/${props.set.id}`}>
        <MoreVertical
          className="ml-auto"
          color="white"
          width={18}
          height={18}
        />
      </Link>
    </TouchableOpacity>
  );
}
