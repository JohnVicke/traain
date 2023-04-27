import { Text, View } from "react-native";

import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { Loading } from "./generate/loading";

export default function Workouts() {
  const { data, error, isLoading } = api.workout.getAll.useQuery();

  if (isLoading) {
    return (
      <View className="h-full w-full items-center justify-center">
        <Loading />
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
    <View className="h-full">
      {data.map((workout) => (
        <Button key={workout.id} asLink href={`/workout/${workout.id}`}>
          Go to workout: {workout.id}
        </Button>
      ))}
    </View>
  );
}
