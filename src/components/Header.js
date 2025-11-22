// /src/components/Header.js (Final Integrated Code)

import React from 'react';
// Import the styling file (adjust path if your Hero.css is elsewhere)
import '../../src/Hero.css'; 
// Import your profile picture
import profilePic from "./me2.jpeg"; 
// Import icon for the scroll indicator
import { FaChevronDown } from 'react-icons/fa'; 

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
        
        {/* Wrapper for Image + Aesthetic Code Background */}
        <div className="hero-image-with-bg">
          <img src={profilePic} alt="Yasir Sultan" className="hero-image" />
          
          {/* Faux background code with syntax highlighting structure */}
          <div className="background-overlay">
             <pre className="bg-code">
                <span className="keyword">const</span> <span className="variable">scale</span> <span className="operator">=</span> <span className="string">'k8s'</span>; <br/>
                <span className="comment">$ docker build</span> <br/>
                <span className="selector">.about</span> <span className="property">.content</span> <br/>
                <span className="at-rule">@media</span> <span className="keyword">screen</span>
             </pre>
          </div>
        </div>
      </div>
      
      {/* Scroll Down Indicator with Animation */}
      <a href="#about" className="scroll-indicator" aria-label="Scroll down to About section">
        <FaChevronDown /> 
      </a>
    </section>
  );
};

export default Header;