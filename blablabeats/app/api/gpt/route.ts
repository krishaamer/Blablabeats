import ky from "ky";
import type { NextApiRequest, NextApiResponse } from "next";

import { NextResponse } from "next/server";
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
export async function POST(msg: string) {
  
  try {

    const GetSoundDescriptions = () => {
      return ["None", "Laugh", "Clap", "Cheer", "Awwww", "Boo"];
    };

    const gptResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
          {
              role: "user",
              content: msg
          }
      ],
      functions: [
        {
          name: "choose_appropriate_sound",
          description:
            "Decides what sound (if any) to play based on the current conversation. Should be appropriate to the conversation. If no sound is appropriate, return None.",
          parameters: {
            type: "object",
            properties: {
              sound: {
                type: "string",
                enum: GetSoundDescriptions(),
              },
            },
          },
          required: ["sound"],
        }
      ],
    });

    return NextResponse.json(gptResponse);
  } catch (err) {
    console.error("ERROR IN CHATGPT PIPELINE", err);
    return NextResponse.json(err);
  }
}
