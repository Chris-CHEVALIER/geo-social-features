import { RouterProvider } from 'react-router-dom'
import { router } from '../router'

/**
 * Composant racine de l'application
 *
 * RouterProvider est le composant qui permet d'activer React Router dans toute l'application.
 * Il prend en props un objet 'router' qui contient toute la configuration des routes.
 */
function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
