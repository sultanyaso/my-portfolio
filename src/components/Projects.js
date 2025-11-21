// /src/components/Projects.js
import React from 'react';
import '../Projects.css'; // Add import for new CSS

const Projects = () => {
  const projects = [
    { title: 'Simple Notes App', description: 'Full-stack MERN app with CRUD', link: 'https://github.com/yourusername/simple-notes' },
    { title: 'Chess AI', description: 'Python chess game with Minimax AI', link: 'https://github.com/yourusername/chess-ai' }
  ];

  return (
    <section className="projects-container" id="projects">
      <h2>Portfolio</h2>
      <div className="projects-grid">
        {projects.map((proj, index) => (
          <div key={index} className="project-card">
            <h3>{proj.title}</h3>
            <p>{proj.description}</p>
            <a href={proj.link} target="_blank" rel="noopener noreferrer" className="project-link">
              View Project
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;