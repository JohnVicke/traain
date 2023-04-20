import React from "react";
import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { MoreVertical } from "lucide-react-native";
import {
  Controller,
  useForm,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

import { api, type RouterInputs } from "~/utils/api";
import { PillSelect } from "~/components/ui/pill-select";
import { TextInputField } from "~/components/ui/text-inputfield";
import { Loading } from "./loading";

interface ExerciseCardProps {
  exercise: {
    name: string;
    sets: number;
    reps: string;
  };
}

interface SetRowProps {
  index: number;
}

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

function ExerciseCard(props: ExerciseCardProps) {
  const { exercise } = props;
  return (
    <View className="rounded-lg bg-slate-800 p-4">
      <Text className="text-md font-bold text-slate-50">{exercise.name}</Text>
      <View className="my-3 h-px w-full bg-slate-500/50" />
      <View className="flex">
        {new Array(exercise.sets).fill(0).map((_, index) => (
          <SetRow key={`set-row-${exercise.name}-${index}`} index={index} />
        ))}
      </View>
    </View>
  );
}

function WorkoutSummary() {
  return (
    <View className="rounded-lg bg-slate-800 p-4">
      <Text className="text-md font-bold text-slate-50">Workout name</Text>
    </View>
  );
}

type GenerateWorkoutInput = RouterInputs["workout"]["create"];

const muscleGroups: {
  value: GenerateWorkoutInput["muscleGroups"][number];
  display: string;
}[] = [
  { value: "legs", display: "Legs" },
  { value: "back", display: "Back" },
  { value: "core", display: "Core" },
  { value: "shoulders", display: "Shoulders" },
  { value: "biceps", display: "Biceps" },
  { value: "triceps", display: "Triceps" },
  { value: "chest", display: "Chest" },
];

type MuscleGroupSelectProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
};

function MuscleGroupSelect<T extends FieldValues>(
  props: MuscleGroupSelectProps<T>,
) {
  return (
    <PillSelect
      control={props.control}
      name={props.name}
      options={muscleGroups}
      multiple
      rules={{ required: true }}
    />
  );
}

const equipmentStyle: {
  value: GenerateWorkoutInput["equipmentStyle"];
  display: string;
}[] = [
  { value: "none", display: "None" },
  { value: "fully equipped gym", display: "Fully equipped gym" },
];

type EquipmentSelectProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
};

function EquipmentSelect<T extends FieldValues>(
  props: EquipmentSelectProps<T>,
) {
  return (
    <PillSelect
      control={props.control}
      name={props.name}
      options={equipmentStyle}
      rules={{ required: true }}
    />
  );
}

type WorkoutForm = {
  muscleGroups: typeof muscleGroups;
  equipmentStyle: (typeof equipmentStyle)[number];
  minutes: string;
};

export default function Workout() {
  const { mutate, data, isLoading } = api.workout.create.useMutation();
  const { control, handleSubmit } = useForm<WorkoutForm>({
    defaultValues: {
      muscleGroups: [],
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutate({
      equipmentStyle: data.equipmentStyle.value,
      muscleGroups: data.muscleGroups.map((v) => v.value),
      minutes: parseInt(data.minutes, 10),
    });
  });

  return (
    <SafeAreaView className="bg-slate-900">
      <Stack.Screen options={{ title: "Workout" }} />
      {isLoading ? (
        <View className="h-full w-full items-center justify-center">
          <Loading />
        </View>
      ) : data ? (
        <View className="my-2 h-full w-full px-2">
          {data?.exercises && data.exercises.length > 0 && (
            <FlashList
              data={data.exercises}
              renderItem={({ item }) => <ExerciseCard exercise={item} />}
              keyExtractor={(item) => item.name}
              estimatedItemSize={200}
              ItemSeparatorComponent={() => <View className="h-4" />}
            />
          )}
        </View>
      ) : (
        <KeyboardAvoidingView className="mt-2 flex h-full w-full">
          <MuscleGroupSelect control={control} name="muscleGroups" />
          <TextInputField
            control={control}
            name="minutes"
            placeholder="60"
            keyboardType="number-pad"
            rules={{ required: true }}
          />
          <EquipmentSelect control={control} name="equipmentStyle" />
          <TouchableOpacity
            className="rounded bg-pink-400 p-2"
            onPress={() => void onSubmit()}
          >
            <Text className="text-center font-semibold text-white">
              Generate workout
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}
