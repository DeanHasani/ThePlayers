import React from 'react';

const VideoBackground = () => {
  return (
    <video autoPlay muted loop id="myVideo">
      <source src="/video/promo.mp4" type="video/mp4" />
    </video>
  );
};

export default VideoBackground;