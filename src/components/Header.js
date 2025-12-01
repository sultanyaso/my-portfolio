// /src/components/Header.js

import React, { useEffect } from "react";
import "../../src/Hero.css";
import profilePic from "./yasirSultan.png";
import { FaChevronDown } from "react-icons/fa";

const Header = () => {

  // --- Smokey Cursor Effect ---

// ---- RIBBON WAVE TRAIL EFFECT ---- //

useEffect(() => {
  let ribbonSegments = [];

  const createRibbon = (x, y) => {
    const segment = document.createElement("div");
    segment.className = "ribbon-segment";

    segment.style.left = x + "px";
    segment.style.top = y + "px";

    document.body.appendChild(segment);

    ribbonSegments.push(segment);

    // Remove segment after animation
    setTimeout(() => {
      segment.style.opacity = "0";
      segment.style.transform = "scale(1.8)";
    }, 10);

    setTimeout(() => {
      segment.remove();
    }, 900);
  };

  const smoothFollow = (e) => {
    createRibbon(e.clientX, e.clientY);
  };

  window.addEventListener("mousemove", smoothFollow);

  return () => window.removeEventListener("mousemove", smoothFollow);
}, []);


  return (
    <section className="hero-container" id="home">

      {/* 🌫️ Smokey Gradient Background */}
      <div className="smoke-layer"></div>

      {/* --- Navigation Bar --- */}
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

      {/* --- Hero Content --- */}
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

          <a href="#projects" className="cta-button">VIEW MY WORK</a>
        </div>

        {/* Image with Code Background */}
        <div className="hero-image-with-bg">
          <img src={profilePic} alt="Yasir Sultan" className="hero-image" />

          <div className="background-overlay">
            <pre className="bg-code">
              <span className="keyword">const</span> <span className="variable">scale</span> <span className="operator">=</span> <span className="string">'k8s'</span>;{"\n"}
              <span className="comment">$ docker build</span>{"\n"}
              <span className="selector">.about</span> <span className="property">.content</span>{"\n"}
              <span className="at-rule">@media</span> <span className="keyword">screen</span>
            </pre>
          </div>
        </div>
      </div>

      {/* Scroll Button */}
      <a href="#about" className="scroll-indicator">
        <FaChevronDown />
      </a>

    </section>
  );
};

export default Header;
