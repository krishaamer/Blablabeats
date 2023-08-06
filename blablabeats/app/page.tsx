'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { PencilIcon } from 'lucide-react'
import * as z from 'zod'
import { Button } from '../components/ui/button'
import beatsList from '../data/audioList'
import EditBeatForm from './component/EditBeatDialog'

const formSchema = z.object({
  prompt: z.string().min(2, {
    message: 'Prompt must be at least 4 characters.',
  }),
})

export default function Home() {
  const playSound = (audio) => {
    const audioFile = new Audio(audio)
    audioFile.play()
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Welcome to BlaBlaBeats
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {beatsList.map((beat) => (
          <div
            key={beat.name}
            className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
          >
            <div className="flex-shrink-0">
              <div className="rounded-full text-3xl">{beat.emoji}</div>
            </div>
            <div className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() => playSound(beat.source)}
                className="focus:outline-none "
              >
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">{beat.name}</p>
              </button>
            </div>
            <EditBeatForm beat={beat} />
          </div>
        ))}
      </div>
    </main>
  )
}
