import { createOpenAI } from "@ai-sdk/openai";
export const deepseek = createOpenAI({
  baseURL: process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY ?? "",
});
export const model = deepseek("deepseek-chat");
