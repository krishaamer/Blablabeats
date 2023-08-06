'use client'

import { useCallback, useEffect } from 'react'
import beatsList from '../data/audioList'
import AudioListener from './components/AudioListener'
import EditBeatForm from './components/EditBeatDialog'
import { useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { ExternalLink, Link2OffIcon } from 'lucide-react'
import Link from 'next/link'
import { cn } from '../lib/utils'
import { Button } from '../components/ui/button'

// and we ref this from the storage, storage the source of truth

export default function Home() {
  const [sounds, setSounds] = useState([])
  const [audio, setAudio] = useState('')

  const playSound = (audio) => {
    const audioFile = new Audio(audio)
    audioFile.play()
  }

  const onUpdate = (prompt, beat, result) => {
    if (sessionStorage.getItem('sounds')) {
      const data: any = sessionStorage.getItem('sounds')
      const json = JSON.parse(data)

      json.map((item) => {
        if (item.name === beat.name) {
          item.source = result
          item.name = prompt
        }
        return item
      })
      sessionStorage.setItem('sounds', JSON.stringify(json))
      setSounds(json)
    }
  }

  useEffect(() => {
    if (sessionStorage.getItem('sounds') === null) {
      sessionStorage.setItem('sounds', JSON.stringify(beatsList))
    }

    if (sessionStorage.getItem('sounds')) {
      const data: any = sessionStorage.getItem('sounds')
      // deep compare the data
      if (JSON.stringify(sounds) !== data) {
        setSounds(JSON.parse(data))
      }
    }
  }, [sounds])

  useHotkeys('ctrl+k, cmd+k', () => {
    sessionStorage.clear()
    if (sessionStorage.getItem('sounds') === null) {
      sessionStorage.setItem('sounds', JSON.stringify(beatsList))
    }
  })

  // format an audio file name to a beat name
  // capitalize the first letter of each word and remove dashes
  // for example "bass-drum-1" becomes "Bass Drum 1"
  const formatBeatName = useCallback((audio) => {
    const name = audio.split('/').pop().split('.')[0]
    const words = name.split('-')
    const formattedWords = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    )
    return formattedWords.join(' ')
  }, [])

  const onAudioPlay = async (audio) => {
    setAudio(audio)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setAudio('')
  }

  const resetToDefaults = () => {
    const _sounds = JSON.stringify(beatsList)
    sessionStorage.setItem('sounds', _sounds)
    setSounds(JSON.parse(_sounds))
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#130726] text-white">
      <header className="h-[3.5rem] border-b border-b-gray-700 bg-gray-800 shadow-sm">
        <div className="item-center relative mx-auto flex h-full justify-between px-4 sm:px-6 lg:px-8">
          <h1 className="borel flex h-full items-center pt-4 text-2xl font-semibold text-white">
            BlaBlaBeats
          </h1>
          <Link
            href="https://github.com/ytsheng/Blablabeats"
            target="_blank"
            className="flex flex-row items-center justify-center hover:underline"
          >
            Github <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </header>
      <div className="flex h-[calc(100vh-3.5rem)] flex-row">
        <main className="background-animate relative flex h-full w-3/5 flex-col bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
          <div className="absolute inset-0 bg-black bg-opacity-80" />
          <AudioListener onAudioPlay={onAudioPlay} />
        </main>

        <aside className="inset-y-0 right-0 w-2/5 overflow-y-auto border-l border-gray-700 px-4 py-6 sm:px-6 lg:px-8 xl:block">
          <div className="flex justify-between">
            <div className="pb-10 text-xl font-medium text-white lg:pb-6">
              Soundboard
            </div>
            <div>
              <Button
                onClick={resetToDefaults}
                variant={'ghost'}
                size={'sm'}
                className="text-red-500"
              >
                Reset
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {sounds.map((beat: any) => (
              <div
                key={beat.name}
                className={cn(
                  'group relative flex items-center space-x-3 rounded-lg border border-gray-700 bg-gray-800 px-4 py-4 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-600',
                  audio === beat.source &&
                    'border-green-500 bg-green-800 hover:border-green-600'
                )}
              >
                <div className="min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => playSound(beat.source)}
                    className="focus:outline-none"
                  >
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-left text-sm font-medium text-white">
                      {formatBeatName(beat.name)}
                    </p>
                  </button>
                </div>
                <EditBeatForm onUpdate={onUpdate} beat={beat} />
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
