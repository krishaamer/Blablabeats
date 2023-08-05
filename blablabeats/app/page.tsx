const beats = [
  {
    name: 'Laugh Track',
    emoji: '😂',
    audio: 'mp4 link',
  },
  {
    name: 'Applause',
    emoji: '👏',
    audio: 'mp4 link',
  },
  {
    name: 'Boo',
    emoji: '👎',
    audio: 'mp4 link',
  },
  {
    name: 'Crickets',
    emoji: '🦗',
    audio: 'mp4 link',
  },
  {
    name: 'Air Horn',
    emoji: '📯',
    audio: 'mp4 link',
  },
  {
    name: 'Sad Trombone',
    emoji: '🙁',
    audio: 'mp4 link',
  },
  {
    name: 'Rimshot',
    emoji: '🥁',
    audio: 'mp4 link',
  },
  {
    name: 'Dramatic Sting',
    emoji: '🎻',
    audio: 'mp4 link',
  },
  {
    name: 'Jeopardy Theme',
    emoji: '🎹',
    audio: 'mp4 link',
  },
  {
    name: 'Game Show Buzzer',
    emoji: '🔕',
    audio: 'mp4 link',
  },
  {
    name: 'Game Show Ding',
    emoji: '🔔',
    audio: 'mp4 link',
  },
  {
    name: 'Game Show Correct',

    emoji: '✅',
    audio: 'mp4 link',
  },
  {
    name: 'Game Show Wrong',
    emoji: '❌',
    audio: 'mp4 link',
  },
  {
    name: 'Game Show Lose',
    emoji: '🚫',
    audio: 'mp4 link',
  },
  {
    name: 'Game Show Win',
    emoji: '🏆',
    audio: 'mp4 link',
  },
]

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Welcome to BlaBlaBeats
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {beats.map((beat) => (
          <div
            key={beat.name}
            className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
          >
            <div className="flex-shrink-0">
              <div className="rounded-full text-3xl">{beat.emoji}</div>
            </div>
            <div className="min-w-0 flex-1">
              <a href="#" className="focus:outline-none">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">{beat.name}</p>
              </a>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
