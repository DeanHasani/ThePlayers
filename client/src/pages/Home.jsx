import React from 'react';
import { Link } from 'react-router-dom';
import VideoBackground from '../components/VideoBackground';

const Home = () => {
  return (
    <>
      <VideoBackground />
      <div className="container">
        <div className="fade">
          <img className="spinner" src="/images/whiteclub.svg" alt="logo" />
        </div>
        <Link to="/shop" className="btn">Enter the Game</Link>
      </div>
    </>
  );
};

export default Home;