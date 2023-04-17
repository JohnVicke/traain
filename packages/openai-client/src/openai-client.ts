import {
  Configuration,
  OpenAIApi,
  type ChatCompletionRequestMessage,
} from "openai";
import { z } from "zod";

import { systemPrompt } from "./workout-system-prompt";

function parseWorkout(workoutString: string) {
  return workoutString.split("\n").map((exercise) => {
    const [name, sets, reps] = exercise.split(",");
    const parsedExercise = exerciseSchema.safeParse({
      name,
      sets,
      reps,
    });

    return parsedExercise.success ? parsedExercise.data : null;
  });
}

const exerciseSchema = z.object({
  name: z.string(),
  sets: z.number(),
  reps: z.string().refine((value) => {
    if (!value.includes("-")) {
      return value;
    }
    const [min, max] = value.split("-");
    return Number(min) < Number(max);
  }),
});

const workoutSchema = z.object({
  exercises: z.array(
    z.object({
      name: z.string(),
      sets: z.number(),
      reps: z.string().refine((value) => {
        const [min, max] = value.split("-");
        return Number(min) < Number(max);
      }),
    }),
  ),
});

export class OpenAiClient {
  private readonly client: OpenAIApi;

  constructor(apiKey: string) {
    const configuration = new Configuration({
      apiKey,
    });
    this.client = new OpenAIApi(configuration);
  }

  public async complete(options: { messages: ChatCompletionRequestMessage[] }) {
    const response = await this.client.createChatCompletion({
      temperature: 0.9,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      model: "gpt-3.5-turbo",
      messages: [systemPrompt, ...options.messages],
    });

    if (!response.data.choices[0]?.message?.content) {
      throw new Error("No choices returned from OpenAI");
    }

    const workout = response.data.choices[0].message.content;
    const start = workout.indexOf("$$");
    const end = workout.lastIndexOf("$$", start + 1);
    const workoutString = workout.substring(start + 2, end);
    return parseWorkout(workoutString);
  }
}

let aiClient: OpenAiClient | null = null;

export function createOpenAiClient(): OpenAiClient {
  if (!aiClient) {
    aiClient = new OpenAiClient(process.env.OPENAI_API_KEY as string);
  }
  return aiClient;
}
