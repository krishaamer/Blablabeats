import ky from 'ky'
import type { NextApiRequest, NextApiResponse } from 'next'
import Replicate from 'replicate'

import { NextResponse } from 'next/server'

export async function POST(req: NextApiRequest) {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN ?? '',
    })
    const { text } = req.body

    const output = await replicate.run(
      'pollinations/music-gen:9b8643c06debace10b9026f94dcb117f61dc1fee66558a09cde4cfbf51bcced6',
      {
        input: {
          text: text,
        },
      }
    )
    return NextResponse.json(output)
  } catch (err) {
    console.error('assembly ai token error', err)
    return NextResponse.json(err)
  }
}
