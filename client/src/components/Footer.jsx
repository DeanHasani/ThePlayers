import React from 'react';
import { NavLink } from 'react-router-dom';
import whiteclub from '../assets/whiteclub.svg';
import instagram from '../assets/instagram.svg';
import whatsapp from '../assets/whatsapp.svg';
import '../styles/main.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-line"></div>
      <NavLink to="/home" className="footer-logo-link">
        <img src={whiteclub} alt="The Players Club Logo" className="footer-logo" />
      </NavLink>
      <p className="footer-title">THE PLAYERS CLUB</p>
      <p className="footer-copyright">
        The content of this site is copyright-protected and is the property of THE PLAYERS CLUB owners.
      </p>
      <div className="footer-social">
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="footer-instagram-link">
          <img src={instagram} alt="Instagram" className="footer-instagram" />
        </a>
        <a href="https://www.whatsapp.com" target="_blank" rel="noopener noreferrer" className="footer-whatsapp-link">
          <img src={whatsapp} alt="WhatsApp" className="footer-whatsapp" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;