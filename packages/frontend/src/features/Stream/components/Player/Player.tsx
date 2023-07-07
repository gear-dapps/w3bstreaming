import React from 'react';
import videojs from 'video.js';
import styles from './Player.module.scss';
import { cx } from '@/utils';
import { PlayerProps } from './Player.interfaces';
import 'video.js/dist/video-js.css';

const videoJsOptions = {
  autoplay: true,
  controls: true,
  responsive: true,
  fluid: true,
};

function Player({ options, onReady }: any) {
  const videoRef = React.useRef<HTMLDivElement>(null);
  const playerRef = React.useRef<any>(null);

  React.useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement('video-js');

      videoElement.classList.add('vjs-big-play-centered');
      videoRef.current?.appendChild(videoElement);

      playerRef.current = videojs(videoElement, videoJsOptions, () => {
        videojs.log('player is ready');
        if (onReady) {
          onReady(playerRef.current);
        }
      });

      // You could update an existing player in the `else` block here
      // on prop change, for example:
    }
  }, [videoRef, onReady]);

  // Dispose the Video.js player when the functional component unmounts
  React.useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player>
      <div ref={videoRef} className="video-js" />
    </div>
  );
}

export { Player };
