import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // optional


// src/index.js (Example using HashRouter for GitHub Pages)


// Install React Router first: npm install react-router-dom
import { HashRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);