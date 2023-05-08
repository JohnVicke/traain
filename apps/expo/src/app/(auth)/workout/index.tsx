import { Text, View } from "react-native";

import { api } from "~/utils/api";
import { LoadingIndicator } from "~/components/loading-indicator";
import { Button } from "~/components/ui/button";

export default function Workouts() {
  const { data, error, isLoading } = api.workout.getAll.useQuery();

  if (isLoading) {
    return (
      <View className="h-full w-full items-center justify-center">
        <LoadingIndicator size={70} />
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>... ops something went wrong</Text>
      </View>
    );
  }

  return (
    <View className="flex h-full px-4 pt-24">
      {data.map((workout) => (
        <Button key={workout.id} asLink href={`/workout/${workout.id}`}>
          Go to workout: {workout.id}
        </Button>
      ))}
    </View>
  );
}
