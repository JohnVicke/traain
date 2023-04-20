import React, { useEffect } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { AnimatePresence } from "moti";
import {
  useForm,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

import { api, type RouterInputs } from "~/utils/api";
import { KeyboardAvoidView } from "~/components/keyboard-avoid-view";
import { Button } from "~/components/ui/button";
import { PillSelect } from "~/components/ui/pill-select";
import { TextInputField } from "~/components/ui/text-inputfield";
import { Loading } from "./loading";
import { WorkoutList } from "./workout-list";

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
  className?: string;
};

function MuscleGroupSelect<T extends FieldValues>(
  props: MuscleGroupSelectProps<T>,
) {
  return (
    <PillSelect
      {...props}
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
  className?: string;
};

function EquipmentSelect<T extends FieldValues>(
  props: EquipmentSelectProps<T>,
) {
  return (
    <PillSelect
      {...props}
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

  useEffect(() => {
    mutate({
      example: true,
      muscleGroups: ["chest", "triceps"],
      minutes: 60,
      equipmentStyle: "fully equipped gym",
    });
  }, []);

  const onSubmit = handleSubmit((data) => {
    mutate({
      equipmentStyle: data.equipmentStyle.value,
      muscleGroups: data.muscleGroups.map((v) => v.value),
      minutes: parseInt(data.minutes, 10),
      example: true,
    });
  });

  return (
    <SafeAreaView className="bg-slate-900 px-4">
      <Stack.Screen options={{ title: "Workout" }} />
      <AnimatePresence exitBeforeEnter>
        {isLoading ? (
          <View className="h-full w-full items-center justify-center">
            <Loading />
          </View>
        ) : data?.exercises && data.exercises.length > 0 ? (
          <WorkoutList workout={data} />
        ) : (
          <KeyboardAvoidView className="mt-2 flex h-full w-full">
            <MuscleGroupSelect control={control} name="muscleGroups" />
            <TextInputField
              className="my-4"
              control={control}
              name="minutes"
              placeholder="60"
              keyboardType="number-pad"
              rules={{ required: true }}
            />
            <EquipmentSelect control={control} name="equipmentStyle" />
            <Button className="mt-4" onPress={() => void onSubmit()}>
              Generate workout
            </Button>
          </KeyboardAvoidView>
        )}
      </AnimatePresence>
    </SafeAreaView>
  );
}
