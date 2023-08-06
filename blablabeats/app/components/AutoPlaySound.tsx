import React, { useEffect } from 'react'

function AutoPlaySound({ soundUrl }) {
  useEffect(() => {
    if (!soundUrl) return
    const audio = new Audio(soundUrl)
    audio.play()
  }, [soundUrl]) // Adding soundUrl to the dependency array

  return <div />
}

export default AutoPlaySound
