import AudioListener from '../components/AudioListener'

const about = () => {
  return (
    <div className="align-center flex h-screen w-screen flex-col items-center justify-center bg-pink-400">
      <a className="text-2xl text-white" href="https://x.ai">
        AI Simp
      </a>
      <p className="text-2xl text-black">Lord simp queen</p>
      <a href="/" className="text-xl font-bold text-black">
        MAKE SOME MUSIC
      </a>
      <AudioListener />
    </div>
  )
}

export default about
