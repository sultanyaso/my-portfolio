// /src/components/Projects.js
import React from 'react';
import '../Projects.css'; // Add import for new CSS

const Projects = () => {
  const projects = [
    { title: 'Simple Notes App', description: 'Full-stack MERN app', link: 'https://github.com/sultanyaso/mern-demo.git' },
    { title: 'dodge', description: 'A simple Python game using Pygame', link: 'https://github.com/sultanyaso/dodge-the-blocks-game.git' },
    {title: 'Weather-Web-App', description: 'A simple weather app built with HTML, CSS, and JavaScript.', link: 'https://github.com/sultanyaso/Weather_Web_App.git'},
    {title: 'github-profile-finder',description: 'This GitHub Profile Finder is a React-based web application.',link: 'https://github.com/sultanyaso/github-profile-finder.git'},
    {title: 'NodeVault',description: 'A Containerized CLI Record Management System.',link: 'https://github.com/sultanyaso/DevOps_Part2.git'},
    {title: 'Shortest Path Finder (Pakistan)',description: 'A real-world route planning application that uses Dijkstra’s Algorithm and OpenStreetMap road data to find and visualize the shortest paths between Pakistani cities.
',link: 'https://github.com/sultanyaso/Design-and-Algorithm-Project.git'}
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
