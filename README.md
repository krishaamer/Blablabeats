<p align="center">
  <a href="https://blablabeats.vercel.app">
    <img alt="Real-time sound/music generation tailored to the rhythm of your conversations." src="/social.png">
  </a>
</p>

<p align="center">
  <a href="https://github.com/hackgoofer/Blablabeats/blob/main/license"><img alt="MIT License" src="https://img.shields.io/badge/license-MIT-blue"></a>
  <a href="https://prettier.io"><img alt="Prettier Code Formatting" src="https://img.shields.io/badge/code_style-prettier-brightgreen.svg"></a>
</p>

- [Intro](#intro)
- [How it works](#how-it-works)
- [Demo](#demo)
- [Local development](#local-development)
- [Contributions](#contributions)
- [License](#license)

## Intro

[OutsideLLM](https://www.outsidellms.com/) hackathon project that audibly tunes into your daily chats and seamlessly cues music or sound effects to match the vibe of your conversation.

## How it works

- [Assembly AI](https://www.assemblyai.com) is used for real-time speech-to-text, so users can ask the podcast host questions using their voice.
- [GPT](https://openai.com/) is used to decide what sound/music bytes to play based on conversational context.
- [MusiGen](https://arxiv.org/abs/2306.05284) is used to generate additional sound/music bytes conditioned on text, GPT will then take into the generated music/sound into consideration when picking which sound bytes to play.

## Demo

[Demo](https://blablabeats.vercel.app)

Note, we may keep this running for a while but we will shut it down if it becomes expensive for us. Sowwy. But you should be able to run it on your own with the instructions specified under "Build Locally" section.

## Local development

0. [Install `pnpm`](https://pnpm.io/installation)
1. Run `pnpm i` to install dependencies
2. `cp .env.example .env` and fill in all of the environment variables:

```
ASSEMBLY_AI_API_KEY=
REPLICATE_API_TOKEN=
OPENAI_API_KEY=
```

3. Run `pnpm dev`

## Contributions

PRs are more than welcome. In particular, we need:

1. More default sounds
2. Login / DB so that we can persist user's generated audio
3. MusicGen has as sound model, integrate that
4. With the inspiration of BumbleBee, we want to be able to have a sound retrieval conditioned on text that is from famous music/movie clips.

## License

MIT © [Sasha Sheng](https://twitter.com/hackgoofer), [Miles Miller](https://twitter.com/milesvesh) and [Alec Dewitz](https://twitter.com/alecdewitz)
