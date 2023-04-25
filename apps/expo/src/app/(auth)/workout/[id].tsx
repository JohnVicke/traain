import { Text, View } from "react-native";
import { useSearchParams } from "expo-router";

import { api } from "~/utils/api";
import { Loading } from "./generate/loading";
import { WorkoutList } from "./workout-list";

export default function Workout() {
  const { id } = useSearchParams();

  if (typeof id !== "string") {
    throw new Error("unexpected error");
  }

  const { data, error, isLoading } = api.workout.get.useQuery({ id });

  if (isLoading) {
    return (
      <View className="h-full w-full items-center justify-center">
        <Loading />
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

  return <WorkoutList workout={data} />;
}
