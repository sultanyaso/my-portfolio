import React from 'react';
import Header from './components/Header';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import WhatsAppButton from "./components/WhatsAppButton";

function App() {
  return (
    <div>
      <Header />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <WhatsAppButton />  
    </div>
  );
}

export default App;
