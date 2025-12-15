import React, { useState } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import SwipeableEdgeDrawer from '../components/SwipeableEdgeDrawer';

function App() {
  // État pour contrôler l'ouverture/fermeture du drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Fonction pour ouvrir le drawer
  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
  };

  // Fonction pour fermer le drawer
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        gap: 3
      }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Swipeable Edge Drawer
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Cliquez sur le bouton ci-dessous ou swipez depuis le bas de l'écran
          pour ouvrir le drawer.
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={handleOpenDrawer}
        >
          Ouvrir le drawer
        </Button>

        {/* Le composant Drawer avec les props nécessaires */}
        <SwipeableEdgeDrawer
          open={isDrawerOpen}
          onOpen={handleOpenDrawer}
          onClose={handleCloseDrawer}
        />
      </Box>
    </Container>
  );
}

export default App;
