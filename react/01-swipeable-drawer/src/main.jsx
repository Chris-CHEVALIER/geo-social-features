import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Point d'entrée de l'application React
// C'est ici que React se connecte au DOM
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
