import { describe, expect, it } from "vitest";

import { csvToWorkout } from "../workout-parser";

describe("parseWorkout", () => {
  it("parses a workout", () => {
    const csv =
      "$$\n" +
      '"Flat Bench Press", 4, "8-12"\n' +
      '"Incline Dumbbell Fly", 3, "10-15"\n' +
      '"Tricep Pushdown", 3, "12-15"\n' +
      '"Barbell Curl", 3, "8-12"\n' +
      '"Seated Cable Row", 4, "8-12"\n' +
      '"Lat Pulldown", 3, "10-15"\n' +
      '"Inverted Row", 3, "10-12"\n' +
      '"Cable Bicep Curl", 3, "12-15"\n' +
      '"Dumbbell Hammer Curl", 3, "10-12"\n' +
      "$$";
    const result = csvToWorkout(csv);
    expect(result).toEqual([
      {
        name: "Flat Bench Press",
        sets: 4,
        reps: "8-12",
      },
      {
        name: "Incline Dumbbell Fly",
        sets: 3,
        reps: "10-15",
      },
      {
        name: "Tricep Pushdown",
        sets: 3,
        reps: "12-15",
      },
      {
        name: "Barbell Curl",
        sets: 3,
        reps: "8-12",
      },
      {
        name: "Seated Cable Row",
        sets: 4,

        reps: "8-12",
      },
      {
        name: "Lat Pulldown",
        sets: 3,
        reps: "10-15",
      },
      {
        name: "Inverted Row",
        sets: 3,
        reps: "10-12",
      },
      {
        name: "Cable Bicep Curl",
        sets: 3,
        reps: "12-15",
      },
      {
        name: "Dumbbell Hammer Curl",
        sets: 3,
        reps: "10-12",
      },
    ]);
  });
});
