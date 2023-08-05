import ky from 'ky'
import type { NextApiRequest, NextApiResponse } from 'next'

import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('token...')
    const token = await ky
      .post('https://api.assemblyai.com/v2/realtime/token', {
        json: { expires_in: 3600 },
        headers: { authorization: process.env.ASSEMBLY_AI_API_KEY },
      })
      .json()

    return NextResponse.json(token)
  } catch (err) {
    console.error('assembly ai token error', err)
    return NextResponse.json(err)
  }
}
