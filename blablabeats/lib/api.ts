import ky from "ky";

import * as config from "./config";
import { debug } from "console";

export async function fetchAssemblyAIRealtimeToken() {
  const url = `${config.apiBaseUrl}/api/token`;

  const res = await ky(url).json<any>();

  return res.token as string;
}
