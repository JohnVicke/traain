import {
  Configuration,
  OpenAIApi,
  type ChatCompletionRequestMessage,
} from "openai";

import { csvToWorkout } from "./workout-parser";
import { systemPrompt } from "./workout-system-prompt";

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
    console.log({ workout });
    const start = workout.indexOf("$$");
    const end = workout.lastIndexOf("$$");
    const workoutString = workout.substring(start, end);
    return csvToWorkout(workoutString);
  }
}

let aiClient: OpenAiClient | null = null;

export function createOpenAiClient(): OpenAiClient {
  if (!aiClient) {
    aiClient = new OpenAiClient(process.env.OPENAI_API_KEY as string);
  }
  return aiClient;
}
