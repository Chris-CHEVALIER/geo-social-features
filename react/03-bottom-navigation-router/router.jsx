import { createBrowserRouter, Outlet } from 'react-router-dom'
import Home from './pages/Home'
import Map from './pages/Map'
import Profile from './pages/Profile'
import BottomNavigation from './components/BottomNavigation'

/**
 * Layout principal de l'application
 *
 * Ce composant enveloppe toutes les pages et affiche :
 * - <Outlet /> : l'emplacement où les pages s'afficheront
 * - <BottomNavigation /> : la barre de navigation fixe en bas
 *
 * Le Layout reste affiché sur toutes les pages, seul le contenu de <Outlet /> change.
 */
function Layout() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      paddingBottom: '70px' // Espace pour la barre de navigation
    }}>
      {/* Zone où le contenu des pages s'affiche */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* Barre de navigation toujours visible */}
      <BottomNavigation />
    </div>
  )
}

/**
 * Configuration du router
 *
 * createBrowserRouter() crée un router qui utilise l'API History du navigateur.
 * Cela permet de naviguer sans recharger la page, comme une vraie application mobile.
 *
 * Structure :
 * - Route racine "/" avec le Layout
 * - Routes enfants : chaque page de l'application
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        // Route par défaut : page d'accueil
        index: true,
        element: <Home />,
      },
      {
        // Route pour la carte
        path: 'map',
        element: <Map />,
      },
      {
        // Route pour le profil
        path: 'profile',
        element: <Profile />,
      },
    ],
  },
])
