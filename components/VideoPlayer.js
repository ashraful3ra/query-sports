import { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const VideoPlayer = ({ streamUrl }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!streamUrl) return;

    if (playerRef.current) {
      playerRef.current.src({ type: 'application/x-mpegURL', src: streamUrl });
      return;
    }

    const videoElement = videoRef.current;
    if (!videoElement) return;

    playerRef.current = videojs(videoElement, {
      autoplay: true,
      controls: true,
      responsive: true,
      fluid: true,
    });

    playerRef.current.src({ type: 'application/x-mpegURL', src: streamUrl });

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [streamUrl]);

  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js vjs-big-play-centered" />
    </div>
  );
};

export default VideoPlayer;
