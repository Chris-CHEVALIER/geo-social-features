import React, { useState } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import SwipeableEdgeDrawer from '../components/SwipeableEdgeDrawer';

function App() {
  // 📌 useState : crée une variable d'état "isDrawerOpen"
  // - false au départ = le drawer est fermé
  // - setIsDrawerOpen() permet de changer cette valeur
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // 📌 Fonction qui met isDrawerOpen à true pour ouvrir le drawer
  const openDrawer = () => {
    setIsDrawerOpen(true);
  };

  // 📌 Fonction qui met isDrawerOpen à false pour fermer le drawer
  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <Container maxWidth="sm">
      {/* 📌 Box : conteneur pour centrer le contenu à l'écran */}
      <Box
        sx={{
          minHeight: '100vh',        // Hauteur minimum = toute la hauteur de l'écran
          display: 'flex',           // Utilise flexbox pour le layout
          flexDirection: 'column',   // Empile les éléments verticalement
          justifyContent: 'center',  // Centre verticalement
          alignItems: 'center',      // Centre horizontalement
          textAlign: 'center',       // Texte centré
          gap: 3                     // Espace entre les éléments
        }}
      >
        {/* 📌 Titre principal */}
        <Typography variant="h3" component="h1">
          Swipeable Edge Drawer
        </Typography>

        {/* 📌 Texte d'explication */}
        <Typography variant="body1" color="text.secondary">
          Cliquez sur le bouton ou swipez depuis le bas de l'écran
        </Typography>

        {/* 📌 Bouton qui appelle openDrawer() quand on clique dessus */}
        <Button
          variant="contained"
          size="large"
          onClick={openDrawer}
        >
          Ouvrir le drawer
        </Button>

        {/* 📌 Le composant Drawer :
            - open : lui dit s'il doit être ouvert ou fermé
            - onOpen : fonction à appeler quand on l'ouvre
            - onClose : fonction à appeler quand on le ferme */}
        <SwipeableEdgeDrawer
          open={isDrawerOpen}
          onOpen={openDrawer}
          onClose={closeDrawer}
        />
      </Box>
    </Container>
  );
}

export default App;
