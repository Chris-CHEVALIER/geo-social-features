# Swipeable Drawer Component

Composant React de tiroir coulissant (drawer) avec effet de balayage, utilisant Material-UI.

## Comment intégrer ce composant dans votre projet React

Pour copier ce composant dans votre propre projet React existant, suivez ces étapes :

1. **Installer les dépendances Material-UI** (si ce n'est pas déjà fait) :
   ```bash
   npm install @mui/material @emotion/react @emotion/styled
   ```

2. **Copier le fichier du composant** :
   - Copiez le fichier `components/SwipeableEdgeDrawer.jsx` dans votre dossier de composants

3. **Importer et utiliser le composant** :
   ```jsx
   import SwipeableEdgeDrawer from './components/SwipeableEdgeDrawer';

   function App() {
     return (
       <div>
         <SwipeableEdgeDrawer />
       </div>
     );
   }
   ```

4. **Personnaliser** :
   - Modifiez le contenu dans la section du drawer selon vos besoins
   - Ajustez les styles et les couleurs à votre charte graphique

---

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
