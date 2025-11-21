// /src/components/About.js (REVISED - NO IMAGE)

import React from "react";
// Ensure this path is correct relative to the About.js file
import "../About.css"; 
// Note: profilePic is still imported but not used in the return() block

const About = () => {
  return (
    <section className="about-container" id="about">
      {/* Use the modified class for a full-width card */}
      <div className="about-card about-card-full"> 
        
        {/* IMAGE WRAPPER HAS BEEN REMOVED */}

        <div className="about-content">
          <h2>About Me</h2>
          <p>
            My name is Yasir Sultan. I am a passionate student at the National University of Computer and Emerging Sciences (FAST‑NUCES), Islamabad, currently focusing on DevOps practices and modern software development.
          </p>
          <p>
            I have hands-on experience in full‑stack development, focusing on building scalable web applications. I thrive on problem‑solving, love turning complex ideas into meaningful projects, and am committed to continuous learning in rapidly evolving technology landscapes.
          </p>
          <p>
            I enjoy working with technologies like React, Node.js, MongoDB, Docker, Kubernetes, Git, and GitHub. In my free time, I explore new tools, contribute to open source, and experiment with side projects using my core tech stack.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;