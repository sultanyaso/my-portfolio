// /src/components/Contact.js (REVISED WITH ICONS)

import React from 'react';
// Ensure you have react-icons installed: npm install react-icons
import { FaEnvelope, FaPhone, FaGithub } from 'react-icons/fa';
import '../Contact.css'; // Add import for new CSS

const Contact = () => {
  return (
    <section className="contact-container" id="contact">
      <h2>Get In Touch</h2>
      <div className="contact-list">
        <a href="mailto:sultanyasir990@gmail.com" className="contact-item">
          <FaEnvelope className="contact-icon" />
          <span>sultanyasir990@gmail.com</span>
        </a>

        <a href="https://github.com/sultanyaso" target="_blank" rel="noopener noreferrer" className="contact-item">
          <FaGithub className="contact-icon" />
          <span>github.com/sultanyaso</span>
        </a>

        <a href="tel:+923485185767" className="contact-item">
          <FaPhone className="contact-icon" />
          <span>+92 348 5185767</span>
        </a>
      </div>
    </section>
  );
};

export default Contact;