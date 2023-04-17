import { z } from "zod";

export const equipmentStyleSchema = z.enum([
  "none",
  "bands",
  "dumbbells",
  "barbell",
  "kettlebell",
  "bodyweight",
  "machine",
  "cable",
  "resistance",
  "fully equipped gym",
]);
