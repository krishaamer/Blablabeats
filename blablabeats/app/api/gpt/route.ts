import ky from "ky";
import type { NextApiRequest, NextApiResponse } from "next";
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function POST(req: Request | NextRequest) {

  try {
    const { msg } = await req.json()
    console.log("msg!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n", msg);
    // const GetSoundDescriptions = (userSounds: string[]) => {
    //   // Generate sound descriptions based on user input
    //   return ["None", ...userSounds];
    // };

    // const userSounds = ; // Example user-defined sounds

    const gptResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-0613",
      messages: [
          {
              role: "user",
              content: "Choose a sound if necessary for the conversation up to this: "+msg
          }
      ],
      functions: [
        {
          name: "choose_sound",
          description:
            "Decides what sound (if any) to play based on the current conversation. Should be appropriate to the conversation. If no sound is appropriate, return None.",
          parameters: {
            type: "object",
            properties: {
              sound_to_play: {
                type: "string",
                description: "one of the valid sounds to play",
                enum: ["None","Laugh", "Clap", "Cheer", "Cry"]
              },
            },
          },
          required: ["sound_to_play"],
        }
      ],
    });
    return NextResponse.json(gptResponse.data.choices);
  } catch (err) {
    console.error("ERROR IN CHATGPT PIPELINE", err);
    return NextResponse.json(err);
  }
}
