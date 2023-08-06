// scripts/generateAudioList.js
const fs = require('fs')
const path = require('path')

const audioDir = path.join(__dirname, '..', 'public', 'audio')
const audioFiles = fs
  .readdirSync(audioDir)
  .filter((file) => file.endsWith('.mp3') || file.endsWith('.wav'))

const audioList = audioFiles.map((file) => ({
  name: file.split('.')[0],
  source: `/audio/${file}`,
}))

fs.writeFileSync(
  path.join(__dirname, '..', 'data', 'audioList.js'),
  `export default ${JSON.stringify(audioList)};`
)
