import {
  Configuration,
  OpenAIApi,
  type CreateChatCompletionRequest,
} from "openai";

export class OpenAiClient {
  private readonly client: OpenAIApi;

  constructor(apiKey: string) {
    const configuration = new Configuration({
      organization: "org-oFy2JhAxjHSuMWEwCkfgR3aQ",
      apiKey,
    });
    this.client = new OpenAIApi(configuration);
  }

  public async complete(
    options: Pick<CreateChatCompletionRequest, "messages">,
  ) {
    const response = await this.client.createChatCompletion({
      temperature: 0.9,
      max_tokens: 100,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      model: "gpt-3.5-turbo",
      ...options,
    });

    if (!response.data.choices[0]?.message?.content) {
      throw new Error("No choices returned from OpenAI");
    }

    return response.data.choices[0].message.content;
  }
}

let aiClient: OpenAiClient | null = null;

export function createOpenAiClient(): OpenAiClient {
  if (!aiClient) {
    aiClient = new OpenAiClient(process.env.OPENAI_API_KEY as string);
  }
  return aiClient;
}
