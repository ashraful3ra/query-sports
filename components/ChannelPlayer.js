import { useEffect, useRef } from 'react';

const ChannelPlayer = ({ streamUrl }) => {
  const playerRef = useRef(null);

  useEffect(() => {
    const loadJWPlayer = () => {
      // Dynamically load JW Player script from CDN
      const script = document.createElement('script');
      script.src = 'https://cdn.jwplayer.com/libraries/your-library-id.js';
      script.async = true;
      script.onload = () => {
        window.jwplayer(playerRef.current).setup({
          file: streamUrl,
          width: '100%',
          height: '100%',
        });
      };
      document.body.appendChild(script);

      // Cleanup script on component unmount
      return () => {
        if (window.jwplayer) {
          window.jwplayer(playerRef.current).remove();
        }
        document.body.removeChild(script);
      };
    };

    if (streamUrl) {
      loadJWPlayer();
    }

  }, [streamUrl]);

  return <div ref={playerRef} id="player"></div>;
};

export default ChannelPlayer;
