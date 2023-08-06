'use client'

import { useCallback, useEffect } from 'react'
import beatsList from '../data/audioList'
import EditBeatForm from './components/EditBeatDialog'
import AudioVisualizer from './components/AudioVisualizer'
import AudioListener from './components/AudioListener'

// and we ref this from the storage, storage the source of truth

export default function Home() {
  const playSound = (audio) => {
    const audioFile = new Audio(audio)
    audioFile.play()
  }

  const onUpdate = (values) => {
    console.log(values)
  }

  useEffect(() => {
    if (localStorage.getItem('sounds') === null) {
      localStorage.setItem('sounds', JSON.stringify(beatsList))
    }

    if (localStorage.getItem('sounds')) {
      const data: any = localStorage.getItem('sounds')
      console.log(JSON.parse(data))
    }
  }, [])

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

  return (
    <div className="max-h-screen">
      <main className="flex h-screen max-h-screen w-3/5 flex-col">
        <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6">
          Welcome to BlaBlaBeats
        </div>
        <AudioListener />
        <AudioVisualizer />
      </main>

      <aside className="fixed inset-y-0 right-0 hidden w-2/5 overflow-y-auto border-l border-gray-200 px-4 py-6 sm:px-6 lg:px-8 xl:block">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {beatsList.map((beat) => (
            <div
              key={beat.name}
              className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-3 py-4 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
            >
              <div className="flex-shrink-0">
                <div className="rounded-full text-3xl">{beat.emoji}</div>
              </div>
              <div className="min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => playSound(beat.source)}
                  className="focus:outline-none"
                >
                  <span className="absolute inset-0" aria-hidden="true" />
                  <p className="text-left text-sm font-medium text-gray-900">
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
  )
}
