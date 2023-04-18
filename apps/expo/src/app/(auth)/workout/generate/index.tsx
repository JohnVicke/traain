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
  Control,
  Controller,
  FieldValues,
  Path,
  useForm,
} from "react-hook-form";

import { RouterInputs, api } from "~/utils/api";

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

type GenerateWorkoutForm = Omit<
  RouterInputs["workout"]["create"],
  "minutes"
> & { minutes: string };

const muscleGroups: GenerateWorkoutForm["muscleGroups"] = [
  "legs",
  "back",
  "core",
  "shoulders",
  "biceps",
  "triceps",
  "chest",
];

type MuscleGroupSelectProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
};

function MuscleGroupSelect<T extends FieldValues>(
  props: MuscleGroupSelectProps<T>,
) {
  return (
    <Controller
      control={props.control}
      name={props.name}
      render={({ field: { onChange, value } }) => (
        <View className="flex flex-row flex-wrap gap-x-4 gap-y-2">
          {muscleGroups.map((group) => (
            <TouchableOpacity
              key={group}
              className="mb-2 rounded-lg bg-slate-800 p-2"
              onPress={() => {
                if (value?.includes(group)) {
                  onChange(
                    (
                      value as unknown as GenerateWorkoutForm["muscleGroups"]
                    ).filter(
                      (g: GenerateWorkoutForm["muscleGroups"][number]) =>
                        g !== group,
                    ),
                  );
                  return;
                }
                onChange([...value, group]);
              }}
            >
              {value?.includes(group) ? (
                <Text className="text-pink-400">{group}</Text>
              ) : (
                <Text className="text-slate-50">{group}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    />
  );
}

const equipmentStyle: GenerateWorkoutForm["equipmentStyle"][] = [
  "none",
  "fully equipped gym",
];

type EquipmentSelectProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
};

function EquipmentSelect<T extends FieldValues>(
  props: EquipmentSelectProps<T>,
) {
  return (
    <Controller
      control={props.control}
      name={props.name}
      render={({ field: { onChange, value } }) => (
        <View className="flex flex-row flex-wrap gap-x-4 gap-y-2">
          {equipmentStyle.map((equipment) => (
            <TouchableOpacity
              key={equipment}
              className="mb-2 rounded-lg bg-slate-800 p-2"
              onPress={() => onChange(equipment)}
            >
              {value === equipment ? (
                <Text className="text-pink-400">{equipment}</Text>
              ) : (
                <Text className="text-slate-50">{equipment}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    />
  );
}

export default function Workout() {
  const { mutate, data, isLoading } = api.workout.create.useMutation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<GenerateWorkoutForm>({
    defaultValues: {
      muscleGroups: [],
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    mutate({
      equipmentStyle: data.equipmentStyle,
      muscleGroups: data.muscleGroups,
      minutes: parseInt(data.minutes, 10),
    });
  });

  return (
    <SafeAreaView className="bg-slate-900">
      <Stack.Screen options={{ title: "Workout" }} />
      {data ? (
        <View className="my-2 h-full w-full">
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
        <KeyboardAvoidingView className="mt-2 h-full w-full">
          <MuscleGroupSelect control={control} name="muscleGroups" />
          {errors.muscleGroups && (
            <Text className="text-red-400">This is required.</Text>
          )}
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                onBlur={onBlur}
                placeholder="60"
                keyboardType="number-pad"
                className="mb-2 rounded bg-white/10 p-2 text-white"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                onChangeText={onChange}
                value={value?.toString()}
              />
            )}
            name="minutes"
          />
          {errors.minutes && (
            <Text className="text-red-400">This is required.</Text>
          )}
          <EquipmentSelect control={control} name="equipmentStyle" />
          {errors.equipmentStyle && (
            <Text className="text-red-400">This is required.</Text>
          )}
          <TouchableOpacity
            className="rounded bg-pink-400 p-2"
            onPress={onSubmit}
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
