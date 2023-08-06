export const environment = process.env.NODE_ENV || 'development'
export const isDev = environment === 'development'
export const isServer = typeof window === 'undefined'
export const isSafari =
  !isServer && /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

export const title = 'Bla bla beats'
export const description =
  'Real-time sound/music generation tailored to the rhythm of your conversations.'
export const domain = 'blablabeats.vercel.app'

export const author0 = 'Sasha Sheng'
export const author1 = 'Miles Miller'
export const author2 = 'Alec Dewitz'

export const authors = `${author0} and ${author1}`
export const twitter0 = 'hackgoofer'
export const twitter1 = 'milesvesh'
export const twitter2 = 'alecdewitz'

export const twitterUrl0 = `https://twitter.com/${twitter0}`
export const twitterUrl1 = `https://twitter.com/${twitter1}`
export const twitterUrl2 = `https://twitter.com/${twitter2}`

export const githubRepoUrl = 'https://github.com/ytsheng/Blablabeats'
export const copyright = `Copyright 2023 ${authors}`
export const madeWithLove = 'Made with ❤️ in SF'

export const port = process.env.PORT || '3000'
export const prodUrl = `https://${domain}`
export const url = isDev ? `http://localhost:${port}` : prodUrl

export const apiBaseUrl =
  isDev || !process.env.VERCEL_URL ? url : `https://${process.env.VERCEL_URL}`

// these must all be absolute urls
export const socialImageUrl = `${url}/social.jpg`
