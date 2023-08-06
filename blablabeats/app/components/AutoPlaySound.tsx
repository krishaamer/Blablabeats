import React, { useEffect } from 'react';

function AutoPlaySound({ soundUrl }) {
  useEffect(() => {
    const audio = new Audio(soundUrl);
    audio.play();
  }, [soundUrl]);  // Adding soundUrl to the dependency array

  return (
    <div>
    </div>
  );
}

export default AutoPlaySound;