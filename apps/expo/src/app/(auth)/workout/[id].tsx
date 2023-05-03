import { Text, View } from "react-native";
import { useSearchParams } from "expo-router";

import { api } from "~/utils/api";
import { LoadingIndicator } from "~/components/loading-indicator";
import { WorkoutList } from "~/modules/workout/workout-list";

export default function Workout() {
  const { id } = useSearchParams();

  const { data, error, isLoading } = api.workout.get.useQuery({ id });

  if (isLoading) {
    return (
      <View className="h-full w-full items-center justify-center">
        <LoadingIndicator size={72} />
      </View>
    );
  }

  if (error || !data?.exercises || data?.exercises?.length === 0) {
    return (
      <View>
        <Text>... ops something went wrong</Text>
      </View>
    );
  }

  return (
    <View className="bg-slate-900 px-2 pt-8">
      <WorkoutList workout={data} />
    </View>
  );
}
