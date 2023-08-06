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

const EditBeatForm = ({ beat }) => {
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
    console.log(values)
    // await 2 seconds
    await new Promise((r) => setTimeout(r, 2000))
    setIsOpen(false)
    toast.success('Successfully updated!')
    reset()
    await new Promise((r) => setTimeout(r, 500))
  }

  return (
    <Form {...form} key={beat.name}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
          <DialogTrigger>
            <div className="relative z-10 rounded-md bg-white px-2 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              <PencilIcon className="h-4 w-4" />
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
