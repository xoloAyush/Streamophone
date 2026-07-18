import { llm } from "../config/langchain.js";

export async function generate(prompt) {
    const response = await llm.invoke(prompt);

    return response.content;
}