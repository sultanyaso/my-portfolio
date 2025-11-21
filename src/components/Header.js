// /src/components/Header.js
import React from 'react';
// Assuming you create a new Hero.css for the styling
import '../../src/Hero.css'; 
// Import your profile picture
import profilePic from "./me2.jpeg"; 

const Header = () => {
  return (
    <section className="hero-container" id="home">
      {/* --- Top Navigation Bar --- */}
      <nav className="navbar">
        <div className="logo">YASIR SULTAN</div>
        <ul className="nav-links">
          <li><a href="#about">ABOUT</a></li>
          <li><a href="#skills">SKILLS</a></li>
          <li><a href="#projects">PORTFOLIO</a></li>
          <li><a href="#contact">CONTACT</a></li>
        </ul>
        <div className="language-selector">ENG | UR</div> 
      </nav>

      {/* --- Main Hero Content --- */}
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="gradient-text">
            DEVOPS & <br />
            WEB DEVELOPER
          </h1>
          <p className="subtitle">
            I am Yasir - a passionate student and developer creating <br />
            beautiful, scalable, and responsive applications.
          </p>
          <a href="#projects" className="cta-button">
            VIEW MY WORK
          </a>
        </div>
        
        <div className="hero-image-wrapper">
          <img src={profilePic} alt="Yasir Sultan" className="hero-image" />
          <div className="background-overlay">
             <p className="bg-code">
                const scale = 'k8s'; <br/>
                $ docker build <br/>
                .about .content <br/>
                @media screen
             </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;