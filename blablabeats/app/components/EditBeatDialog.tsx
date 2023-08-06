'use client'

import { Button } from '@/components/ui/button'
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
import { generateMusicGen } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, PencilIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'
import LoadingAnimation from '../../components/LoadingAnimation'

const formSchema = z.object({
  prompt: z.string().min(4, {
    message: 'Prompt must be at least 4 characters.',
  }),
})

const EditBeatForm = ({ beat, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false)

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
    reValidateMode: 'onChange',
  })

  const { handleSubmit, formState, reset } = form
  const { isSubmitting } = formState

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values.prompt)
    const result = await generateMusicGen(values.prompt)
    console.log(result)
    console.log('Alec can you put this in an audio tag, thanks!!')
    setIsOpen(false)
    toast.success('Successfully created new pad!')
    reset()
    await new Promise((r) => setTimeout(r, 500))
  }

  return (
    <Form {...form} key={beat.name}>
      <form
        key={beat.name}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-2"
      >
        <Dialog
          open={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open)
            reset()
          }}
        >
          <DialogTrigger>
            <div className="relative z-10 rounded-md bg-gray-800 px-2 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-600 hover:bg-gray-900">
              <PencilIcon className="h-4 w-4 text-gray-400" />
            </div>
          </DialogTrigger>
          <DialogContent>
            {isSubmitting ? (
              <div className="flex flex-col items-center justify-center">
                <LoadingAnimation />
                Generating new audio file...
              </div>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle className="mb-2">
                    Regenerate Soundboard
                  </DialogTitle>
                  <DialogDescription>
                    <FormField
                      control={form.control}
                      name="prompt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prompt</FormLabel>
                          <FormControl>
                            <Textarea
                              autoFocus={true}
                              placeholder="A laugh in the voice of Steve Carell"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Type in the new audio file you want to replace and
                            click Generate.
                          </FormDescription>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                  <Button
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    type="submit"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Generate'
                    )}
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  )
}
export default EditBeatForm
