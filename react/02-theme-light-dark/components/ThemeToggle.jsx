// Imports des composants Material UI nécessaires
import { IconButton } from '@mui/material'
import Brightness4Icon from '@mui/icons-material/Brightness4' // Icône lune
import Brightness7Icon from '@mui/icons-material/Brightness7' // Icône soleil

/**
 * Composant ThemeToggle
 *
 * Ce composant affiche un bouton pour basculer entre le mode clair et sombre.
 * Il reçoit 2 props (propriétés) du composant parent :
 *   - mode : le mode actuel ('light' ou 'dark')
 *   - toggleTheme : la fonction à appeler pour changer de mode
 */
function ThemeToggle({ mode, toggleTheme }) {
  return (
    <IconButton onClick={toggleTheme} color="inherit">
      {/* Si mode clair : afficher l'icône lune (pour passer au dark) */}
      {/* Si mode sombre : afficher l'icône soleil (pour passer au light) */}
      {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
    </IconButton>
  )
}

export default ThemeToggle
