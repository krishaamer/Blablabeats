import ky from 'ky'

import * as config from './config'

export async function fetchAssemblyAIRealtimeToken() {
  const url = `${config.apiBaseUrl}/api/token`

  const res = await ky(url).json<any>()

  return res.token as string
}

export async function generateMusicGen(text: string) {
  const url = `${config.apiBaseUrl}/api/musicgen`

  // Use the ky.post method and the json shorthand to send the text
  const res = await ky.post(url, { json: { text }, timeout: 60000 }).json<any>()

  return res.token as string
}

export async function fetchOpenAIChatCompletion(msg: string, sounds: string[]) {
  const url = `${config.apiBaseUrl}/api/gpt`
  const res = await ky.post(url, { json: { msg, sounds } }).json<any>()
  return res
}
