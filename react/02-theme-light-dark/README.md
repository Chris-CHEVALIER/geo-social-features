# Gestion de Thème Light/Dark avec React

Ce projet montre comment créer un système de thème clair/sombre simple avec **React** et **Material UI**.

## Démonstration

L'application permet de basculer entre un mode clair et un mode sombre en cliquant sur un bouton. Tous les composants Material UI s'adaptent automatiquement au thème choisi.

## Concepts React utilisés

Ce projet est idéal pour les étudiants qui découvrent React. Il utilise :

- **useState** : pour gérer l'état du thème (clair ou sombre)
- **Props** : pour passer des données entre composants (parent → enfant)
- **Fonctions callbacks** : pour remonter des événements (enfant → parent)
- **Rendu conditionnel** : pour afficher différentes icônes selon le mode

## Structure du projet

```
react/02-theme-light-dark/
├── src/
│   ├── App.jsx          # Composant principal avec gestion du thème
│   ├── App.css          # Styles personnalisés (non utilisé ici)
│   ├── index.css        # Styles de base
│   └── main.jsx         # Point d'entrée de l'application
├── components/
│   └── ThemeToggle.jsx  # Bouton pour basculer le thème
└── package.json         # Dépendances du projet
```

## Installation et lancement

```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev
```

## Comment ça marche ?

### 1. Gestion de l'état dans App.jsx

```javascript
const [mode, setMode] = useState('light')
```

On utilise `useState` pour stocker le mode actuel (valeur initiale : `'light'`).

### 2. Création du thème

```javascript
const theme = createTheme({
  palette: {
    mode: mode, // 'light' ou 'dark'
  },
})
```

Material UI crée automatiquement toutes les couleurs appropriées selon le mode.

### 3. Fonction de basculement

```javascript
const toggleTheme = () => {
  setMode((modeActuel) => (modeActuel === 'light' ? 'dark' : 'light'))
}
```

Cette fonction inverse le mode : si c'est `'light'`, on passe à `'dark'`, et vice-versa.

### 4. Application du thème

```jsx
<ThemeProvider theme={theme}>
  <CssBaseline />
  {/* Vos composants */}
</ThemeProvider>
```

Le `ThemeProvider` applique le thème à tous les composants Material UI à l'intérieur.

## Intégrer ce composant dans votre projet

Si vous avez déjà un projet React et que vous souhaitez ajouter cette fonctionnalité :

### Étape 1 : Installer Material UI

```bash
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
```

### Étape 2 : Copier le composant ThemeToggle

Copiez le fichier [components/ThemeToggle.jsx](components/ThemeToggle.jsx) dans votre projet (par exemple dans `src/components/`).

### Étape 3 : Modifier votre App.jsx

Ajoutez le code suivant dans votre composant principal :

```jsx
import { useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import ThemeToggle from './components/ThemeToggle'

function App() {
  const [mode, setMode] = useState('light')

  const theme = createTheme({
    palette: {
      mode: mode,
    },
  })

  const toggleTheme = () => {
    setMode((modeActuel) => (modeActuel === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Placez le bouton où vous voulez */}
      <ThemeToggle mode={mode} toggleTheme={toggleTheme} />

      {/* Le reste de votre application */}
    </ThemeProvider>
  )
}
```

### Étape 4 : Utiliser les composants Material UI

Tous vos composants Material UI (Button, Card, Paper, etc.) s'adapteront automatiquement au thème :

```jsx
import { Button, Card, CardContent, Typography } from '@mui/material'

<Card>
  <CardContent>
    <Typography variant="h5">Mon contenu</Typography>
    <Button variant="contained">Mon bouton</Button>
  </CardContent>
</Card>
```

## Personnalisation avancée (optionnelle)

Vous pouvez personnaliser les couleurs du thème :

```javascript
const theme = createTheme({
  palette: {
    mode: mode,
    primary: {
      main: '#1976d2', // Couleur principale en mode clair
    },
    secondary: {
      main: '#dc004e', // Couleur secondaire
    },
  },
})
```

## Ressources

- [Documentation Material UI](https://mui.com/material-ui/)
- [Guide des thèmes Material UI](https://mui.com/material-ui/customization/theming/)
- [Documentation React useState](https://react.dev/reference/react/useState)
