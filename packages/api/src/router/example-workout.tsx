export const exampleWorkout = {
  muscleGroups: ["chest", "triceps"],
  equipmentStyle: "fully equipped gym",
  estimatedMinutes: 60,
  exercises: [
    {
      name: "Bench press",
      sets: 3,
      reps: "8-10",
    },
    {
      name: "Incline dumbbell press",
      sets: 3,
      reps: "10-12",
    },
    {
      name: "Cable flys",
      sets: 3,
      reps: "12-15",
    },
    {
      name: "Tricep pushdowns",
      sets: 3,
      reps: "12-15",
    },
  ],
} as const;
