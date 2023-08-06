import ky from 'ky'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const { Configuration, OpenAIApi } = require('openai')
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export async function POST(req: Request | NextRequest) {
  try {
    // sounds: names
    const { msg, sounds } = await req.json()
    // add 'None' to sounds
    sounds.push('None')
    const gptResponse = await openai.createChatCompletion({
      model: 'gpt-4-0613',
      messages: [
        {
          role: 'user',
          content:
            'Choose a sound if necessary for the conversation up to this: ' +
            msg,
        },
      ],
      functions: [
        {
          name: 'choose_sound',
          description:
            'Decides whether to play a sound (and which) based on the current conversation. If no sound is PERFECT, return None. Do not be annoying.',
          parameters: {
            type: 'object',
            properties: {
              sound_to_play: {
                type: 'string',
                description: 'one of the valid sounds to play',
                enum: sounds,
              },
            },
          },
          required: ['sound_to_play'],
        },
      ],
    })
    // make sure the choice was one of the valid sounds, if not, make it None
    const choice = JSON.parse(
      gptResponse.data.choices[0].message.function_call?.arguments
    ).sound_to_play
    if (!sounds.includes(choice)) {
      return NextResponse.json('None')
    }
    return NextResponse.json(choice)
  } catch (err) {
    console.error('ERROR IN CHATGPT PIPELINE', err)
    return NextResponse.json('None')
  }
}
