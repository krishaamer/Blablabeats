import React, { useRef, useEffect } from 'react'

const AudioVisualizer = () => {
  const canvasRef = useRef(null)
  const audioContextRef = useRef(new AudioContext())
  const analyserRef = useRef(audioContextRef.current.createAnalyser())

  const updateCanvasSize = () => {
    const canvas: any = canvasRef.current
    if (canvas) {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
    }
  }

  useEffect(() => {
    let animationFrameId
    const start = async () => {
      const canvas: any = canvasRef.current
      const ctx = canvas.getContext('2d')

      // Update the canvas size when the component mounts
      updateCanvasSize()

      // Set up a resize event listener to update the canvas size when the window size changes
      window.addEventListener('resize', updateCanvasSize)

      const drawVisualization = () => {
        // Get frequency data
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
        analyserRef.current.getByteFrequencyData(dataArray)

        // Clear canvas
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Draw frequency bars
        const barWidth = (canvas.width / dataArray.length) * 2.5
        let barHeight
        let x = 0
        for (let i = 0; i < dataArray.length; i++) {
          barHeight = dataArray[i] / 2
          ctx.fillStyle = `rgb(${barHeight + 200},50,50)`
          ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight)
          x += barWidth + 1
        }

        animationFrameId = requestAnimationFrame(drawVisualization)
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      })

      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)

      // Your existing code...

      drawVisualization()
    }
    start()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }}></canvas>
  )
}

export default AudioVisualizer
