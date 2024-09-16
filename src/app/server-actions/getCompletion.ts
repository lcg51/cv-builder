"use server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export type ChatGPTRoleType = "user" | "assistant";

console.log('Get completion');

export async function getCompletion(
  messageHistory: {
    role: ChatGPTRoleType;
    content: string;
  }[]
) {
    console.log('Get completion');
    console.log(openai);

    try {

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messageHistory,
        });

        const messages = [
            ...messageHistory,
            response.choices[0].message as unknown as {
              role: ChatGPTRoleType;
              content: string;
            },
        ];
        
        return {
            messages,
        }
        
    } catch (error) {
        console.error(error);

        return {
            messages: messageHistory,
            error: error,
        }
    }
}