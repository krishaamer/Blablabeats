'use client'
import React, { useState } from 'react'
import type RecordRTCType from 'recordrtc'

import { fetchAssemblyAIRealtimeToken } from '@/lib/api'

let recorder
let recordedChunks = []
let socket

let options = {
  audioBitsPerSecond: 128000,
  mimeType: 'audio/webm;codecs=pcm',
}

const AudioListener = () => {
  const [transcript, setTranscript] = useState('')

  const startRecording = async () => {
    console.log('start recording')

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

    socket.onmessage = (message) => {
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

      console.log(stream)
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
  }

  const stopRecording = () => {
    recorder.stopRecording(stopRecordingCallback)
    console.log(recordedChunks)
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
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
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
    </div>
  )
}

export default AudioListener
