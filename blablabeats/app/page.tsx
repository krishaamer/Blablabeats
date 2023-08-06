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
import { PencilIcon } from 'lucide-react'
import * as z from 'zod'
import { Button } from '../components/ui/button'
import beatsList from '../data/audioList'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

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

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
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
                onClick={() => playSound(beat.source)}
                className="focus:outline-none "
              >
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">{beat.name}</p>
              </button>
            </div>
            <div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="mt-4 space-y-2"
                >
                  <Dialog>
                    <DialogTrigger>
                      <button className="relative z-10 rounded-md bg-white px-2 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Regenerate Soundboard</DialogTitle>
                        <DialogDescription>
                          <FormField
                            control={form.control}
                            name="prompt"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Prompt</FormLabel>
                                <FormControl>
                                  <Input
                                    autoFocus={true}
                                    placeholder="A laugh in the voice of Steve Carell"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Type in the new audio file you want to replace
                                  and click Generate.
                                </FormDescription>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button type="submit">Generate</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </form>
              </Form>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
