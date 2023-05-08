import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "moti";

import { api } from "~/utils/api";
import { LoadingIndicator } from "~/components/loading-indicator";
import { WorkoutList } from "~/modules/workout/workout-list";

const paramAsString = (param?: string | string[]) =>
  typeof param === "string" ? param : "";

export default function Workout() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, error, isLoading } = api.workout.get.useQuery({
    id: paramAsString(id),
  });

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
    <SafeAreaView className="px-2 pt-8">
      <WorkoutList workout={data} />
    </SafeAreaView>
  );
}
