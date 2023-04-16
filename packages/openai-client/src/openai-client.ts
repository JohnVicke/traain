import { Configuration, OpenAIApi, type CreateCompletionRequest } from "openai";

export class OpenAiClient {
  private readonly client: OpenAIApi;

  constructor(apiKey: string, basePath = "https://api.openai.com/v1") {
    const configuration = new Configuration({
      apiKey,
      basePath,
    });
    this.client = new OpenAIApi(configuration);
  }

  public async complete(
    options: Pick<CreateCompletionRequest, "prompt" | "model">,
  ) {
    const response = await this.client.createCompletion({
      temperature: 0.9,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      ...options,
    });

    if (!response.data.choices[0]?.text) {
      throw new Error("No choices returned from OpenAI");
    }

    return response.data.choices[0]?.text;
  }
}
