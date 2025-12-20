// /src/components/Header.js

import React, { useEffect, useState } from "react";
import "../../src/Hero.css";
import profilePic from "./yasirSultan.png";
import { FaChevronDown } from "react-icons/fa";

const Header = () => {

  // --- Ribbon Wave Trail Effect ---
  useEffect(() => {
    let ribbonSegments = [];

    const createRibbon = (x, y) => {
      const segment = document.createElement("div");
      segment.className = "ribbon-segment";
      segment.style.left = x + "px";
      segment.style.top = y + "px";
      document.body.appendChild(segment);
      ribbonSegments.push(segment);

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

  // --- Typewriter Effect for Subtitle (LOOPING) ---
  const subtitleParts = [
    { text: "I am Yasir — a software engineering student specializing in ", color: "" },
    { text: "Web", color: "highlight-web" },
    { text: " and ", color: "" },
    { text: "DevOps", color: "highlight-devops" },
    { text: " engineering, focused on ", color: "" },
    { text: "scalable architectures", color: "highlight-arch" },
    { text: ", ", color: "" },
    { text: "automation", color: "highlight-auto" },
    { text: ", ", color: "" },
    { text: "CI/CD pipelines", color: "highlight-cicd" },
    { text: ", and ", color: "" },
    { text: "cloud-native", color: "highlight-cloud" },
    { text: " application development.", color: "" },
  ];

  const [displayedParts, setDisplayedParts] = useState(
    subtitleParts.map(p => ({ ...p, text: "" }))
  );
  const [charIndex, setCharIndex] = useState(0);
  const [writingForward, setWritingForward] = useState(true); // controls typing direction

  const flatText = subtitleParts.map(p => p.text).join("");

  useEffect(() => {
  const typingSpeed = 75; // slower typing speed
  const timeout = setTimeout(() => {
    let currentLength = 0;

    const newParts = subtitleParts.map(p => {
      if (writingForward) {
        if (currentLength >= charIndex + 1) return { ...p, text: "" };
        if (currentLength + p.text.length <= charIndex + 1) {
          currentLength += p.text.length;
          return p;
        } else {
          const remaining = charIndex + 1 - currentLength;
          currentLength += remaining;
          return { ...p, text: p.text.slice(0, remaining) };
        }
      } else {
        if (currentLength >= flatText.length - charIndex) return { ...p, text: "" };
        if (currentLength + p.text.length <= flatText.length - charIndex) {
          currentLength += p.text.length;
          return p;
        } else {
          const remaining = flatText.length - charIndex - currentLength;
          currentLength += remaining;
          return { ...p, text: p.text.slice(0, remaining) };
        }
      }
    });

    setDisplayedParts(newParts);

    if (writingForward) {
      if (charIndex + 1 >= flatText.length) {
        setWritingForward(false);
        setTimeout(() => setCharIndex(charIndex), 1000);
      } else {
        setCharIndex(charIndex + 1);
      }
    } else {
      if (charIndex <= 0) {
        setWritingForward(true);
      } else {
        setCharIndex(charIndex - 1);
      }
    }
  }, typingSpeed); // <-- use typingSpeed here

  return () => clearTimeout(timeout);
}, [charIndex, writingForward, flatText, subtitleParts]);

  return (
    <section className="hero-container" id="home">
      {/* Smokey Gradient Background */}
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

        <a href="/Yasir_Sultan_CV.pdf" download className="download-cv">
          DOWNLOAD CV
        </a>
      </nav>

      {/* --- Hero Content --- */}
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="gradient-text">
            DEVOPS & <br />
            WEB DEVELOPER
          </h1>

          {/* Typewriter Subtitle */}
          <p className="subtitle">
            {displayedParts.map((p, i) => (
              <span key={i} className={p.color}>{p.text}</span>
            ))}
            <span className="cursor">▋</span>
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
