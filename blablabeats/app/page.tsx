'use client'

import { useCallback, useEffect } from 'react'
import beatsList from '../data/audioList'
import AudioListener from './components/AudioListener'
import EditBeatForm from './components/EditBeatDialog'
import { useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

// and we ref this from the storage, storage the source of truth

export default function Home() {
  const [sounds, setSounds] = useState([])
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
      // deep compare the data
      if (JSON.stringify(sounds) !== data) {
        setSounds(JSON.parse(data))
      }
    }
  }, [sounds])

  useHotkeys('ctrl+k, cmd+k', () => {
    localStorage.clear()
    if (localStorage.getItem('sounds') === null) {
      localStorage.setItem('sounds', JSON.stringify(beatsList))
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

  return (
    <div className="h-screen bg-gray-900 text-white">
      <header className="bg-white shadow-sm">
        <div className="mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-lg font-semibold leading-6 text-gray-900">
            BlaBlaBeats
          </h1>
        </div>
      </header>
      <div className="relative flex h-full flex-row">
        <main className="flex h-full w-3/5 flex-1 flex-col">
          <AudioListener />
        </main>

        <aside className="inset-y-0 right-0 w-2/5 overflow-y-auto border-l border-gray-700 px-4 py-6 sm:px-6 lg:px-8 xl:block">
          <div className="pb-10 lg:pb-6">Soundboard</div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {sounds.map((beat: any) => (
              <div
                key={beat.name}
                className="relative flex items-center space-x-3 rounded-lg border border-gray-700 bg-gray-800 px-4 py-4 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-600"
              >
                {/* <div className="flex-shrink-0">
                <div className="rounded-full text-3xl">{beat.emoji}</div>
              </div> */}
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
