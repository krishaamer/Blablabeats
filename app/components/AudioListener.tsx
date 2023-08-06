'use client'

import { fetchOpenAIChatCompletion } from '@/lib/api'
import { useCallback, useRef, useState } from 'react'
import type RecordRTCType from 'recordrtc'
import AutoPlaySound from './AutoPlaySound'
let recorder
let recordedChunks = []
let socket

import { fetchAssemblyAIRealtimeToken } from '@/lib/api'
import { Button } from '../../components/ui/button'
import { MicIcon, PlayIcon, StopCircle, StopCircleIcon } from 'lucide-react'

let options = {
  audioBitsPerSecond: 128000,
  mimeType: 'audio/webm;codecs=pcm',
}
let animationFrameId

// keep track of last time we played a sound so we don't spam too much
let lastPlayed = Date.now()
// also keep track of how often we are sending requests to openai
let lastOpenAIRequest = Date.now()

let lastThreeFinalTranscripts = ['']

let lastTranscript = ''

const AudioListener = ({ onAudioPlay }) => {
  const [transcript, setTranscript] = useState('')
  const [audio, setAudio] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const canvasRef = useRef(null)
  const sourceRef: any = useRef(null)
  const audioContextRef: any = useRef(null)
  const streamRef: any = useRef(null)
  const analyserRef: any = useRef(null)

  const updateCanvasSize = () => {
    const canvas: any = canvasRef.current
    if (canvas) {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight + 50
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
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw frequency bars
      const barWidth = (canvas.width / dataArray.length) * 2.5
      let barHeight
      let x = 0
      for (let i = 0; i < dataArray.length; i++) {
        barHeight = dataArray[i] / 1.2

        // Create gradient from hot pink to magenta
        const gradient = ctx.createLinearGradient(
          x,
          canvas.height - barHeight,
          x,
          canvas.height
        )
        gradient.addColorStop(0, 'hotpink') // start color
        gradient.addColorStop(1, 'magenta') // end color

        ctx.fillStyle = gradient

        ctx.fillRect(x, canvas.height - barHeight / 1.2, barWidth, barHeight)
        x += barWidth + 1
      }

      animationFrameId = requestAnimationFrame(drawVisualization)
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    })
    streamRef.current = stream

    sourceRef.current = audioContextRef.current.createMediaStreamSource(
      streamRef.current
    )
    sourceRef.current.connect(analyserRef.current)

    drawVisualization()
  }

  const startRecording = useCallback(async () => {
    setIsRecording(true)

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

      const combinedTranscript = lastThreeFinalTranscripts.join(' ') + msg

      if (
        res.message_type === 'FinalTranscript' &&
        msg != '' &&
        msg != lastThreeFinalTranscripts[0]
      ) {
        lastThreeFinalTranscripts.push(msg)
        lastThreeFinalTranscripts.shift()
      }

      // captions.innerText = msg;
      // only do this if we have actual words in msg
      if (
        lastTranscript != combinedTranscript &&
        Date.now() - lastOpenAIRequest > 1000
      ) {
        // if it's final, join this transcript with the last 3
        lastTranscript = combinedTranscript
        // combine the last 3 final transcripts + the current transcript
        const data: any = sessionStorage.getItem('sounds')
        const sounds = JSON.parse(data).map((sound) => sound.name)
        const soundToPlay = await fetchOpenAIChatCompletion(
          combinedTranscript,
          sounds
        )
        lastOpenAIRequest = Date.now()
        // we now need to get the url of the sound from our map
        const soundUrl = JSON.parse(data).find(
          (sound) => sound.name === soundToPlay
        )?.source
        // only play the sound if it's been at least 5 seconds since the last one
        if (soundToPlay != 'None') {
          if (Date.now() - lastPlayed > 8000) {
            setAudio(soundUrl)
            onAudioPlay(soundUrl)
            lastPlayed = Date.now()
          }
        }
        console.log('soundUrl: ' + soundUrl)
        // console.log('gptResponse: ' + JSON.stringify(gptResponse))
      }
      console.log('recorded message: ' + combinedTranscript)
      setTranscript(combinedTranscript)
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

      const RecordRTC = (await import('recordrtc'))
        .default as typeof RecordRTCType
      recorder = new RecordRTC(streamRef.current, {
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

      try {
        recorder.startRecording()
      } catch (e) {
        console.log(e)
        setIsRecording(false)
      }
    }
  }, [recorder])

  const stopRecording = () => {
    setIsRecording(false)
    recorder?.stopRecording(stopRecordingCallback)
    console.log(recordedChunks)
    cancelAnimationFrame(animationFrameId)
    updateCanvasSize()
  }

  // Stops recording and ends real-time session.
  const stopRecordingCallback = () => {
    socket?.send(JSON.stringify({ terminate_session: true }))
    socket?.close()
    socket = null

    recorder.destroy()

    sourceRef.current.disconnect()
    recorder = null
  }

  return (
    <div className="relative flex h-full flex-1 flex-col items-center justify-center">
      <div className="flex w-full flex-1 flex-col items-center justify-center">
        {isRecording ? (
          <div className="max-w-md text-center text-3xl text-white">
            {transcript}
          </div>
        ) : (
          <div className="max-w-md text-center">
            BlaBlaBeats adds character to your conversations. Simply press
            {'"Start"'} and start speaking. BlaBlaBeats will listen to your
            conversation and add the necessary beats to it.
          </div>
        )}
        <div className="relative z-10 mt-6 flex items-center justify-center">
          {!isRecording ? (
            <Button size={'lg'} variant={'secondary'} onClick={startRecording}>
              <MicIcon className="mr-2 h-4 w-4" /> Start
            </Button>
          ) : (
            <Button size={'lg'} variant={'destructive'} onClick={stopRecording}>
              <StopCircle className="mr-2 h-4 w-4" /> Stop
            </Button>
          )}
        </div>
      </div>
      <div className="">
        <canvas
          className="absolute bottom-0 left-0 right-0"
          ref={canvasRef}
          style={{ width: '100%' }}
        ></canvas>
      </div>
      <AutoPlaySound soundUrl={audio}></AutoPlaySound>
    </div>
  )
}

export default AudioListener
