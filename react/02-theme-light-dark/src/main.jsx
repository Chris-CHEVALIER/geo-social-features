import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

/**
 * Point d'entrée de l'application React (Vite)
 *
 * Ce fichier initialise l'application React et monte le composant racine <App />
 * dans l'élément HTML avec l'id "root"
 */

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
