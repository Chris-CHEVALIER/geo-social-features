// Imports React
import { useState } from 'react'

// Imports Material UI pour le thème
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

// Imports des composants Material UI
import { AppBar, Toolbar, Typography, Container, Paper, Box, Card, CardContent } from '@mui/material'

// Import de notre composant personnalisé
import ThemeToggle from '../components/ThemeToggle'

/**
 * Composant principal de l'application
 *
 * Ce composant gère le thème clair/sombre et applique ce thème
 * à toute l'application grâce au ThemeProvider de Material UI
 */
function App() {
  // 1. ÉTAT : on stocke le mode actuel ('light' ou 'dark')
  const [mode, setMode] = useState('light')

  // 2. CRÉATION DU THÈME : on crée un thème Material UI selon le mode
  const theme = createTheme({
    palette: {
      mode: mode, // 'light' ou 'dark'
    },
  })

  // 3. FONCTION : pour basculer entre light et dark
  const toggleTheme = () => {
    // Si mode est 'light', on passe à 'dark', sinon on passe à 'light'
    setMode((modeActuel) => (modeActuel === 'light' ? 'dark' : 'light'))
  }

  // 4. RENDU : affichage de l'interface
  return (
    // ThemeProvider : applique le thème à tous les composants enfants
    <ThemeProvider theme={theme}>
      {/* CssBaseline : applique les styles de base et la couleur de fond */}
      <CssBaseline />

      {/* Barre de navigation en haut */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Gestion de Thème Light/Dark
          </Typography>
          {/* Notre bouton pour changer de thème */}
          <ThemeToggle mode={mode} toggleTheme={toggleTheme} />
        </Toolbar>
      </AppBar>

      {/* Contenu principal */}
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        {/* Carte d'accueil */}
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Mode {mode === 'light' ? 'Clair' : 'Sombre'}
          </Typography>
          <Typography variant="body1" paragraph>
            Cette application montre comment utiliser le ThemeProvider de Material UI
            pour basculer entre un thème clair et sombre.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cliquez sur l'icône en haut à droite pour changer de thème.
          </Typography>
        </Paper>

        {/* Grille de cartes d'exemples */}
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Composant Card
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Les composants MUI s'adaptent automatiquement au thème.
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Couleurs Adaptatives
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Les couleurs changent automatiquement selon le mode.
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Dark Mode
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Le mode sombre réduit la fatigue oculaire.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default App
