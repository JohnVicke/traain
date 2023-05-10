import { useState } from "react";
import { Text, TouchableOpacity, View, type Animated } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { FlashList } from "@shopify/flash-list";
import { MoreVertical, PlusSquare, Trash } from "lucide-react-native";
import { AnimatePresence, MotiView } from "moti";
import { useForm } from "react-hook-form";

import { type RouterOutputs } from "@traain/api";

import { api } from "~/utils/api";
import { KeyboardAvoidView } from "~/components/keyboard-avoid-view";
import { TextInputField } from "~/components/ui/text-inputfield";
import EditSetHalfModal from "./edit-set-half-modal";

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
  const utils = api.useContext();
  const { mutate } = api.workoutSet.addSet.useMutation({
    onSuccess: () => {
      void utils.workout.get.invalidate();
    },
  });
  const { exercise, delay } = props;

  const handleAddSet = (id: number) => {
    mutate({ id });
  };

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
      <MotiView className="flex">
        {exercise.sets.map((set, index) => (
          <MotiView
            from={{ translateY: -10, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            key={`set-${index}-row-${exercise.id}-${exercise.exercise.id}`}
          >
            <SetRow index={index} set={set} />
          </MotiView>
        ))}
      </MotiView>
      <View className="my-3 h-px w-full bg-slate-500/50" />
      <TouchableOpacity
        onPress={() => handleAddSet(exercise.id)}
        className="flex flex-row items-center space-x-2"
      >
        <PlusSquare className="text-slate-200" />
        <Text className="text-slate-200">Add set</Text>
      </TouchableOpacity>
    </MotiView>
  );
}

type SetForm = {
  weight: string;
  reps: string;
  notes: string;
};

type SetRowProps = {
  index: number;
  set: WorkoutOutput["exercises"][number]["sets"][number];
};

function SetRow(props: SetRowProps) {
  const utils = api.useContext();

  const { mutate } = api.set.update.useMutation({
    onSuccess: () => {
      void utils.workout.get.invalidate();
    },
  });

  const [modalOpen, setModalOpen] = useState(false);

  const { control, handleSubmit } = useForm<SetForm>({
    defaultValues: {
      notes: props.set?.notes ?? undefined,
      reps: props.set?.reps?.toString(),
      weight: props.set?.weight?.toString(),
    },
  });

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const updateSet = handleSubmit((data) => {
    console.log({ data });
    mutate({
      id: props.set.id,
      reps: data.reps ? +data.reps : undefined,
      weight: data.weight ? +data.weight : undefined,
      notes: data.notes,
    });
  });

  return (
    <Swipeable
      childrenContainerStyle={{ flex: 1 }}
      renderRightActions={(progress, dragX) => (
        <RightActions progress={progress} dragX={dragX} />
      )}
    >
      <View className="mb-2 flex flex-row items-center">
        <View className="relative h-6 w-6 items-center justify-center rounded-full bg-slate-500/50 p-2">
          <Text className="absolute text-xs text-slate-200">
            {props.index + 1}
          </Text>
        </View>
        <View className="ml-4 flex min-w-[50px]">
          <Text className="text-[10px] text-slate-400">Weight</Text>
          <TextInputField
            onBlur={() => void updateSet()}
            variant="ghost"
            control={control}
            name="weight"
            placeholder="0"
            className="p-1 font-bold"
            keyboardType="number-pad"
          />
        </View>
        <View className="ml-2 flex min-w-[50px]">
          <Text className="text-[10px] text-slate-400">Reps</Text>
          <TextInputField
            onBlur={() => void updateSet()}
            variant="ghost"
            control={control}
            name="reps"
            placeholder="0"
            className="p-1 font-bold"
            keyboardType="number-pad"
          />
        </View>
        <View className="ml-2 flex min-w-[50px]">
          <Text className="text-[10px] text-slate-400">Notes</Text>
          <TextInputField
            onBlur={() => void updateSet()}
            variant="ghost"
            control={control}
            name="notes"
            placeholder={props.set.notes ?? "Add a note..."}
            className="rounded p-1"
            keyboardType="default"
          />
        </View>
        <TouchableOpacity className="ml-auto" onPress={handleOpenModal}>
          <MoreVertical color="white" width={18} height={18} />
        </TouchableOpacity>
        <EditSetHalfModal
          id={props.set.id}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </View>
    </Swipeable>
  );
}

const RightActions = (props: {
  progress: Animated.AnimatedInterpolation<string | number>;
  dragX: Animated.AnimatedInterpolation<string | number>;
}) => {
  const { progress, dragX } = props;
  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-row items-center space-x-2 bg-red-400"
    >
      <Trash className="text-slate-800" />
      <Text>Delete</Text>
    </MotiView>
  );
};
