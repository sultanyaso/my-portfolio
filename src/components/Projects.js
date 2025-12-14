// /src/components/Projects.js
import React from 'react';
import '../Projects.css';

const Projects = () => {
  const projects = [
    {
      title: 'Simple Notes App',
      description: 'Full-stack MERN app',
      link: 'https://github.com/sultanyaso/mern-demo.git'
    },
    {
      title: 'Dodge',
      description: 'A simple Python game using Pygame',
      link: 'https://github.com/sultanyaso/dodge-the-blocks-game.git'
    },
    {
      title: 'Weather Web App',
      description: 'A simple weather app built with HTML, CSS, and JavaScript',
      link: 'https://github.com/sultanyaso/Weather_Web_App.git'
    },
    {
      title: 'GitHub Profile Finder',
      description: 'A React-based web application to find GitHub profiles',
      link: 'https://github.com/sultanyaso/github-profile-finder.git'
    },
    {
      title: 'NodeVault',
      description: 'A containerized CLI record management system',
      link: 'https://github.com/sultanyaso/DevOps_Part2.git'
    },
    {
      title: 'Shortest Path Finder (Pakistan)',
      description: 'A real-world route planning app using Dijkstra’s Algorithm and OpenStreetMap road data',
      link: 'https://github.com/sultanyaso/Design-and-Algorithm-Project.git'
    }
  ];

  return (
    <section className="projects-container" id="projects">
      <h2>Portfolio</h2>
      <div className="projects-grid">
        {projects.map((proj, index) => (
          <div key={index} className="project-card">
            <h3>{proj.title}</h3>
            <p>{proj.description}</p>
            <a
              href={proj.link}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              View Project
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
