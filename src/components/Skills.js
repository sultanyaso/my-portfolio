// /src/components/Skills.js
import React from 'react';
import '../Skills.css'; // Add import for new CSS
const Skills = () => {
  const skills = [
    'React',
    'Node.js',
    'MongoDB',
    'JavaScript',
    'HTML',
    'CSS',
    'Docker',
    'Kubernetes',
    'Git',
    'GitHub'
  ];

  return (
    <section className="skills-container" id="skills">
      <h2>Technologies</h2>
      <ul className="skills-list">
        {skills.map(skill => (
          <li key={skill} className="skill-item">
            {skill}
          </li>
        ))}
      </ul>
      <p className="skills-description">
        I use Docker to containerize applications, Kubernetes to deploy and manage them at scale, and Git + GitHub for version control and collaboration.
      </p>
    </section>
  );
};

export default Skills;