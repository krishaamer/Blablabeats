'use client'

import { fetchOpenAIChatCompletion } from '@/lib/api'
import AutoPlaySound from './AutoPlaySound'
import { useCallback, useEffect, useRef, useState } from 'react'
import type RecordRTCType from 'recordrtc'
let recorder
let recordedChunks = []
let socket

import { fetchAssemblyAIRealtimeToken } from '@/lib/api'
import { set } from 'react-hook-form'

let options = {
  audioBitsPerSecond: 128000,
  mimeType: 'audio/webm;codecs=pcm',
}
let animationFrameId

const AudioListener = () => {
  const [transcript, setTranscript] = useState('')
  const [audio, setAudio] = useState('')
  const canvasRef = useRef(null)
  const audioContextRef: any = useRef(null)
  const streamRef: any = useRef(null)
  const analyserRef: any = useRef(null)

  const updateCanvasSize = () => {
    const canvas: any = canvasRef.current
    if (canvas) {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
    }
  }

  const removeCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current = null
    }
  }

  const start = async () => {
    window.AudioContext =
      window.AudioContext || (window as any).webkitAudioContext
    audioContextRef.current = new AudioContext()
    analyserRef.current = audioContextRef.current.createAnalyser()

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
    streamRef.current = stream

    const source = audioContextRef.current.createMediaStreamSource(
      streamRef.current
    )
    source.connect(analyserRef.current)

    drawVisualization()
  }

  const startRecording = useCallback(async () => {
    console.log('start recording')

    start()

    // Assembly AI audio requirments:
    // WAV PCM16
    //   A sample rate that matches the value of the sample_rate query param you supply
    // Single-channel
    //   100 to 2000 milliseconds of audio per message

    const token = await fetchAssemblyAIRealtimeToken()

    // Handle the data returned by fetchToken here.
    console.log('captured token: ' + token)

    socket = await new WebSocket(
      `wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${token}`
    )
    const texts = {}

    socket.onmessage = async (message) => {
      let msg = ''
      const res = JSON.parse(message.data)
      console.log('res: ' + JSON.stringify(res))

      texts[res.audio_start] = res.text
      const keys = Object.keys(texts)
      keys.sort((a: any, b: any) => a - b)
      for (const key of keys) {
        if (texts[key]) {
          if (msg.split(' ').length > 6) {
            msg = ''
          }
          msg += ` ${texts[key]}`
        }
      }
      // captions.innerText = msg;
      // only do this if we have actual words in msg
      if (msg.split(' ').length > 2 && res.message_type === 'FinalTranscript') {
        const data: any = localStorage.getItem('sounds')
        const sounds = JSON.parse(data).map((sound) => sound.name)
        const soundToPlay = await fetchOpenAIChatCompletion(msg, sounds)
        // we now need to get the url of the sound from our map
        const soundUrl = JSON.parse(data).find(
          (sound) => sound.name === soundToPlay
        ).source
        setAudio(soundUrl)
        console.log('soundUrl: ' + soundUrl)
        // console.log('gptResponse: ' + JSON.stringify(gptResponse))
      }
      console.log('recorded message: ' + msg)
      setTranscript(msg)
    }

    socket.onerror = (event) => {
      console.error(event)
      socket.close()
    }

    socket.onclose = (event) => {
      console.log(event)
      // captions.innerText = ''
      socket = null
    }

    socket.onopen = async () => {
      console.log('onopen')
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      })

      const RecordRTC = (await import('recordrtc'))
        .default as typeof RecordRTCType
      recorder = new RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/webm;codecs=pcm',
        recorderType: RecordRTC.StereoAudioRecorder,
        timeSlice: 250,
        desiredSampRate: 16000,
        numberOfAudioChannels: 1,
        bufferSize: 4096,
        audioBitsPerSecond: 128000,
        ondataavailable: function (blob) {
          const reader = new FileReader()
          reader.onload = () => {
            const base64data = reader.result
            if (socket) {
              socket.send(
                JSON.stringify({
                  audio_data: (base64data as any).split('base64,')[1],
                })
              )
            }
          }
          reader.readAsDataURL(blob)
        },
      })

      recorder.startRecording()
    }
  }, [recorder])

  const stopRecording = () => {
    recorder?.stopRecording(stopRecordingCallback)
    console.log(recordedChunks)
    canvasRef.current = null
    cancelAnimationFrame(animationFrameId)
    removeCanvas()
  }

  // Stops recording and ends real-time session.
  const stopRecordingCallback = () => {
    socket?.send(JSON.stringify({ terminate_session: true }))
    socket?.close()
    socket = null

    recorder.destroy()
    recorder = null
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="flex w-full flex-col rounded-2xl bg-white p-8 text-gray-800 shadow-lg">
        <div className="flex items-center justify-center">
          <div className="p-3">
            <div className="text-xl font-medium text-gray-700">
              Start Speaking
            </div>
          </div>
        </div>
        <div>{transcript}</div>
        <div className="mt-6 flex items-center justify-center">
          <button
            onClick={startRecording}
            className="m-2 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            Start Recording
          </button>

          <button
            onClick={stopRecording}
            className="m-2 rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
          >
            Stop Recording
          </button>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%' }}
      ></canvas>
      <AutoPlaySound 
        soundUrl={audio}></AutoPlaySound>
    </div>
  )
}

export default AudioListener
