import { api } from "~/utils/api";

export default function Page() {
  const { data, isLoading, error } = api.exercise.getAll.useQuery();
  if (isLoading) {
    return <div>isLoading...</div>;
  }
  if (error) {
    return <div>Error!</div>;
  }
  if (!data || data.length === 0) {
    return <div>No data</div>;
  }

  return (
    <div>
      {data.map((exercise) => (
        <div key={exercise.id}>{JSON.stringify(exercise)}</div>
      ))}
    </div>
  );
}
