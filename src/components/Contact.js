import React from 'react';
import { FaEnvelope, FaPhone, FaGithub, FaLinkedin } from 'react-icons/fa';
import '../Contact.css';

const Contact = () => {
  return (
    <section className="contact-container" id="contact">
      <h2 className="fade-in">Contact Me</h2>

      <div className="contact-card slide-up">
        <p className="contact-message fade-in-delay">
          Feel free to reach out for collaboration, project discussions, or opportunities.
        </p>

        <div className="contact-list">

          {/* EMAIL */}
          <a href="mailto:sultanyasir990@gmail.com" className="contact-item pop">
            <FaEnvelope className="contact-icon" />
            <span className="contact-text">sultanyasir990@gmail.com</span>
          </a>

          {/* GITHUB */}
          <a 
            href="https://github.com/sultanyaso" 
            target="_blank"
            rel="noopener noreferrer"
            className="contact-item pop"
            style={{ animationDelay: "0.2s" }}
          >
            <FaGithub className="contact-icon" />
            <span className="contact-text">github.com/sultanyaso</span>
          </a>

          {/* PHONE */}
          <a href="tel:+923485185767" className="contact-item pop" style={{ animationDelay: "0.4s" }}>
            <FaPhone className="contact-icon" />
            <span className="contact-text">+92 348 5185767</span>
          </a>

          {/* LINKEDIN */}
          <a 
            href="https://www.linkedin.com/in/yasir-sultan-931758254?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" 
            target="_blank"
            rel="noopener noreferrer"
            className="contact-item pop"
            style={{ animationDelay: "0.2s" }}
          >
            <FaLinkedin className="contact-icon" />
            <span className="contact-text">linkedin.com/sultanyaso</span>
          </a>

        </div>
      </div>
    </section>
  );
};

export default Contact;
