import { describe, expect, it } from "vitest";

import { csvToWorkout } from "../workout-parser";

describe("parseWorkout", () => {
  it("parses a workout", () => {
    const csv =
      "$$\n" +
      "Bench press, 4, 8-10, chest|triceps\n" +
      "Incline dumbbell press, 3, 10-12, chest\n" +
      "Cable tricep pushdown, 3, 12-15, triceps\n" +
      "Close grip bench press, 3, 8-10, triceps|chest\n" +
      "$$";
    const result = csvToWorkout(csv);
    expect(result).toEqual([
      {
        name: "Bench press",
        sets: 4,
        reps: "8-10",
        muscleGroups: ["chest", "triceps"],
      },
      {
        name: "Incline dumbbell press",
        sets: 3,
        reps: "10-12",
        muscleGroups: ["chest"],
      },
      {
        name: "Cable tricep pushdown",
        sets: 3,
        reps: "12-15",
        muscleGroups: ["triceps"],
      },
      {
        name: "Close grip bench press",
        sets: 3,
        reps: "8-10",
        muscleGroups: ["triceps", "chest"],
      },
    ]);
  });
});
