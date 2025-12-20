// /src/components/Skills.js
import React from 'react';
import '../Skills.css';

const Skills = () => {
  const languages = ['C++','C','Java','Python','JavaScript', 'HTML', 'CSS', 'React','Streamlit','Pandas', 'Node.js', 'MongoDB'];
  const tools = ['Git', 'GitHub','GitHub Actions','Jenkins','Docker','Kubernetes (K8s)','Minikube','Bash'];

  return (
    <section className="skills-container" id="skills">
      <h2>Skills</h2>

      <div className="skills-sections">
        {/* Languages Section */}
        <div className="skills-section">
          <h3>Languages & Frameworks</h3>
          <ul className="skills-list">
            {languages.map(lang => (
              <li key={lang} className="skill-item">
                {lang}
              </li>
            ))}
          </ul>
        </div>

        {/* Tools Section */}
        <div className="skills-section">
          <h3>Tools & Platforms</h3>
          <ul className="skills-list">
            {tools.map(tool => (
              <li key={tool} className="skill-item">
                {tool}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="skills-description">
        I use Docker to containerize applications, Kubernetes to deploy and manage them at scale, and Git + GitHub for version control and collaboration.
      </p>
    </section>
  );
};

export default Skills;
