import React from "react";
import { Text, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import { AnimatePresence } from "moti";
import {
  useForm,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

import { api, type RouterInputs } from "~/utils/api";
import { KeyboardAvoidView } from "~/components/keyboard-avoid-view";
import { LoadingIndicator } from "~/components/loading-indicator";
import { Button } from "~/components/ui/button";
import { Pickerfield } from "~/components/ui/pickerfield";
import { PillSelect } from "~/components/ui/pill-select";
import { WorkoutListPreview } from "~/modules/workout/workout-list-preview";

type GenerateWorkoutInput = RouterInputs["workout"]["generate"];

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
      itemWidth="29%"
      rules={{ required: true }}
    />
  );
}

const equipmentStyle: {
  value: GenerateWorkoutInput["equipmentStyle"];
  display: string;
}[] = [
  { value: "none", display: "None" },
  { value: "fully equipped gym", display: "Fully Equipped Gym" },
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
      itemWidth="45%"
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
  const router = useRouter();
  const { mutate, data, isLoading } = api.workout.generate.useMutation();
  const { control, handleSubmit } = useForm<WorkoutForm>({
    defaultValues: {
      minutes: "60",
      muscleGroups: [{ value: "chest", display: "Chest" }],
      equipmentStyle: { value: "fully equipped gym" },
    },
  });

  const saveAndStartWorkout = (id: number) => {
    router.push(`/workout/${id}`);
  };

  const onSubmit = handleSubmit((data) => {
    mutate({
      equipmentStyle: data.equipmentStyle.value,
      muscleGroups: data.muscleGroups.map((v) => v.value),
      minutes: parseInt(data.minutes, 10),
      example: true,
    });
  });

  return (
    <View className="px-4 pb-8 pt-12">
      <Stack.Screen options={{ title: "Workout" }} />
      <AnimatePresence exitBeforeEnter>
        {isLoading ? (
          <View className="h-full w-full items-center justify-center">
            <LoadingIndicator size={72} />
          </View>
        ) : data?.exercises && data.exercises.length > 0 ? (
          <>
            <Button onPress={() => saveAndStartWorkout(data.id)}>
              Start workout
            </Button>
            <View className="mt-4 h-full">
              <WorkoutListPreview workout={data} />
            </View>
          </>
        ) : (
          <KeyboardAvoidView className="flex h-full w-full">
            <Text className="mb-2 text-xs text-slate-200/60">
              Choose target muscle groups:
            </Text>
            <MuscleGroupSelect control={control} name="muscleGroups" />
            <Text className="mb-2 mt-4 text-xs text-slate-200/60">
              For how Long will you work out?
            </Text>
            <TimePicker control={control} name="minutes" />
            <Text className="mb-2 mt-4 text-xs text-slate-200/60">
              What equipment do you have access to?
            </Text>
            <EquipmentSelect control={control} name="equipmentStyle" />
            <Button className="mt-4" onPress={() => void onSubmit()}>
              Generate workout
            </Button>
          </KeyboardAvoidView>
        )}
      </AnimatePresence>
    </View>
  );
}

const timePickerOptions = [
  {
    value: "45",
    label: "45 min",
  },
  {
    value: "60",
    label: "60 min",
  },
  {
    value: "90",
    label: "90 min",
  },
  {
    value: "120",
    label: "120 min",
  },
];

type TimePickerProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
};

function TimePicker<T extends FieldValues>(props: TimePickerProps<T>) {
  const { control, name } = props;
  return (
    <Pickerfield control={control} name={name} options={timePickerOptions} />
  );
}
