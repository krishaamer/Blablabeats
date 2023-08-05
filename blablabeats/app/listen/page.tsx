"use client";

import React, { useCallback, useState } from "react";
import type RecordRTCType from "recordrtc";

import { fetchAssemblyAIRealtimeToken } from "@/lib/api";
const podcasters = [{ value: "lex-fridman", label: "Lex Fridman" }];

let recorder;
let recordedChunks = [];
let socket;

let options = {
  audioBitsPerSecond: 128000,
  mimeType: "audio/webm;codecs=pcm",
};

const startRecording = async () => {
  console.log("start recording");

  // Assembly AI audio requirments:
  // WAV PCM16
  //   A sample rate that matches the value of the sample_rate query param you supply
  // Single-channel
  //   100 to 2000 milliseconds of audio per message

  const token = await fetchAssemblyAIRealtimeToken();

  // Handle the data returned by fetchToken here.
  console.log("captured token: " + token);

  socket = await new WebSocket(
    `wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${token}`
  );
  const texts = {};

  socket.onmessage = (message) => {
    let msg = "";
    const res = JSON.parse(message.data);
    console.log("res: " + JSON.stringify(res));

    texts[res.audio_start] = res.text;
    const keys = Object.keys(texts);
    keys.sort((a: any, b: any) => a - b);
    for (const key of keys) {
      if (texts[key]) {
        if (msg.split(" ").length > 6) {
          msg = "";
        }
        msg += ` ${texts[key]}`;
      }
    }
    // captions.innerText = msg;
    console.log("recorded message: " + msg);
  };

  socket.onerror = (event) => {
    console.error(event);
    socket.close();
  };

  socket.onclose = (event) => {
    console.log(event);
    // captions.innerText = ''
    socket = null;
  };

  socket.onopen = async () => {
    console.log("onopen");
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });

    console.log(stream);
    const RecordRTC = (await import("recordrtc"))
      .default as typeof RecordRTCType;
    recorder = new RecordRTC(stream, {
      type: "audio",
      mimeType: "audio/webm;codecs=pcm",
      recorderType: RecordRTC.StereoAudioRecorder,
      timeSlice: 250,
      desiredSampRate: 16000,
      numberOfAudioChannels: 1,
      bufferSize: 4096,
      audioBitsPerSecond: 128000,
      ondataavailable: function (blob) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64data = reader.result;
          if (socket) {
            socket.send(
              JSON.stringify({
                audio_data: (base64data as any).split("base64,")[1],
              })
            );
          }
        };
        reader.readAsDataURL(blob);
      },
    });

    recorder.startRecording();
  };
};

const stopRecording = () => {};

// Stops recording and ends real-time session.
const stopRecordingCallback = () => {
  socket.send(JSON.stringify({ terminate_session: true }));
  socket.close();
  socket = null;

  recorder.destroy();
  recorder = null;
};

const IndexPage = () => {
  const [transcript, setTranscript] = useState("");

  const [isRecording, setIsRecording] = useState(false);

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    recorder.stopRecording(stopRecordingCallback);

    console.log("stop recording");
    console.log(recordedChunks);
    console.log(recordedChunks);
  }, [recorder]);

  return (
    <div className="max-w-lg mx-auto p-8 shadow-lg rounded-lg bg-white">
      <h2 className="text-2xl font-semibold mb-4">Speech to Text</h2>
      <div className="mb-4 border p-4 rounded">
        {transcript || "Speak something and see the text here."}
      </div>
      <div className="flex space-x-4">
        <button
          onClick={startRecording}
          className={`p-2 rounded-full ${
            isRecording ? "bg-red-500" : "bg-green-500"
          } text-white`}
        >
          {isRecording ? "Recording..." : "Start"}
        </button>
        <button
          onClick={stopRecording}
          className="p-2 rounded-full bg-gray-400 text-white"
          disabled={!isRecording}
        >
          Stop
        </button>
      </div>
    </div>
  );
};

export default IndexPage;
