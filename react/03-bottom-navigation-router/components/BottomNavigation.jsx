import { useNavigate, useLocation } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home'
import MapIcon from '@mui/icons-material/Map'
import PersonIcon from '@mui/icons-material/Person'

/**
 * Composant de navigation en bas d'écran
 *
 * Ce composant affiche une barre de navigation fixe en bas de l'écran,
 * comme sur les applications mobiles (Instagram, Twitter, etc.)
 *
 * Hooks utilisés :
 * - useNavigate() : permet de naviguer vers une autre route
 * - useLocation() : permet de savoir sur quelle route on se trouve actuellement
 */
function BottomNavigation() {
  // Hook pour naviguer programmatiquement vers une autre route
  const navigate = useNavigate()

  // Hook pour connaître la route actuelle
  const location = useLocation()

  /**
   * Configuration des boutons de navigation
   * Chaque bouton a un chemin, un label et une icône
   */
  const navigationItems = [
    {
      path: '/',
      label: 'Accueil',
      icon: <HomeIcon />,
    },
    {
      path: '/map',
      label: 'Carte',
      icon: <MapIcon />,
    },
    {
      path: '/profile',
      label: 'Profil',
      icon: <PersonIcon />,
    },
  ]

  /**
   * Fonction pour déterminer si un bouton est actif
   * Un bouton est actif si son chemin correspond à la route actuelle
   */
  const isActive = (path) => {
    // Pour la page d'accueil, on vérifie l'égalité stricte
    if (path === '/') {
      return location.pathname === '/'
    }
    // Pour les autres pages, on vérifie si le chemin commence par le path
    return location.pathname.startsWith(path)
  }

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#ffffff',
      borderTop: '1px solid #e0e0e0',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      height: '70px',
      boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
      zIndex: 1000,
    }}>
      {navigationItems.map((item) => {
        const active = isActive(item.path)

        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: active ? '#1976d2' : '#757575',
              transition: 'color 0.2s ease',
              flex: 1,
            }}
          >
            {/* Icône du bouton */}
            <span style={{
              fontSize: '24px',
              marginBottom: '4px',
            }}>
              {item.icon}
            </span>

            {/* Label du bouton */}
            <span style={{
              fontSize: '12px',
              fontWeight: active ? '600' : '400',
            }}>
              {item.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

export default BottomNavigation
