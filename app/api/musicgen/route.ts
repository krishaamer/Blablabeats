import type { NextRequest } from 'next/server'
import Replicate from 'replicate'

import { NextResponse } from 'next/server'

export async function POST(req: Request | NextRequest) {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN ?? '',
    })
    const input = await req.json()
    const text = input.text

    const output = await replicate.run(
      'facebookresearch/musicgen:7a76a8258b23fae65c5a22debb8841d1d7e816b75c2f24218cd2bd8573787906',
      {
        input: {
          model_version: 'melody',
          prompt: text,
          duration: 3,
        },
      }
    )
    return NextResponse.json(output)
  } catch (err) {
    console.error('musicgen error', err)
    return NextResponse.json(err)
  }
}
