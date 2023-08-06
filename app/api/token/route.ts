import ky from 'ky'
import type { NextApiResponse } from 'next'

import { NextResponse } from 'next/server'

export const fetchCache = 'force-no-store'

export async function GET(_, res: NextApiResponse) {
  try {
    const token = await ky
      .post('https://api.assemblyai.com/v2/realtime/token', {
        json: { expires_in: 3600 },
        cache: 'no-cache',
        headers: { authorization: process.env.ASSEMBLY_AI_API_KEY },
      })
      .json()

    return NextResponse.json(token)
  } catch (err) {
    console.error('assembly ai token error', err)
    return NextResponse.json(err)
  }
}
