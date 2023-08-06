import { Player } from '@lottiefiles/react-lottie-player'
import animation from '../data/loading-animation.json'

const LoadingAnimation = () => {
  return <Player className="h-40" src={animation} autoplay loop speed={1} />
}

export default LoadingAnimation
