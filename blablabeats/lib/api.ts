import ky from "ky";

import * as config from "./config";
import { debug } from "console";

export async function fetchAssemblyAIRealtimeToken() {
  const url = `${config.apiBaseUrl}/api/token`;

  const res = await ky(url).json<any>();

  return res.token as string;
}

export async function fetchOpenAIChatCompletion(msg: string) {
  const url = `${config.apiBaseUrl}/api/gpt`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ msg }),
  });

  const data = await response.json();
  return data;
}