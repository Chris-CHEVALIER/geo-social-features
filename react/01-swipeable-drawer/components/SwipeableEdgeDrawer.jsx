import React from 'react';
import { SwipeableDrawer, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Composant de drawer qui peut être ouvert en swipant depuis le bas de l'écran
function SwipeableEdgeDrawer({ open, onOpen, onClose }) {
  return (
    <SwipeableDrawer
      // Ancre en bas de l'écran
      anchor="bottom"
      // État d'ouverture contrôlé par le parent
      open={open}
      // Fonction appelée à l'ouverture
      onOpen={onOpen}
      // Fonction appelée à la fermeture
      onClose={onClose}
      // Permet d'afficher un petit bord visible même quand le drawer est fermé
      swipeAreaWidth={56}
      // Affiche le bord pour permettre le swipe
      disableSwipeToOpen={false}
      // Style pour créer l'effet "edge" (bord visible)
      ModalProps={{
        keepMounted: true, // Garde le drawer monté pour de meilleures performances
      }}
    >
      {/* Zone de préhension visible quand le drawer est fermé */}
      <Box
        sx={{
          position: 'absolute',
          top: -56,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          visibility: 'visible',
          right: 0,
          left: 0,
          backgroundColor: 'background.paper',
          height: 56,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Petite barre indicatrice de swipe */}
        <Box
          sx={{
            width: 40,
            height: 4,
            backgroundColor: 'grey.400',
            borderRadius: 2,
          }}
        />
      </Box>

      {/* Contenu principal du drawer */}
      <Box
        sx={{
          px: 3,
          py: 4,
          height: '50vh',
          overflow: 'auto',
          backgroundColor: 'background.paper',
        }}
      >
        {/* Bouton de fermeture */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <IconButton onClick={onClose} aria-label="Fermer">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Titre du drawer */}
        <Typography variant="h5" component="h2" gutterBottom>
          Contenu du Drawer
        </Typography>

        {/* Contenu d'exemple */}
        <Typography variant="body1" paragraph>
          Ce drawer peut être ouvert de plusieurs façons :
        </Typography>

        <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
          <li>En cliquant sur le bouton "Ouvrir le drawer"</li>
          <li>En swipant vers le haut depuis le bas de l'écran</li>
          <li>En cliquant sur la petite barre grise en bas</li>
        </Typography>

        <Typography variant="body1" paragraph sx={{ mt: 3 }}>
          Vous pouvez le fermer :
        </Typography>

        <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
          <li>En cliquant sur l'icône X en haut à droite</li>
          <li>En swipant vers le bas</li>
          <li>En cliquant en dehors du drawer (sur le fond sombre)</li>
        </Typography>

        <Box sx={{ mt: 4, p: 2, backgroundColor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            💡 Astuce : Vous pouvez personnaliser ce contenu selon vos besoins.
            Ajoutez des formulaires, des listes, des images, etc.
          </Typography>
        </Box>
      </Box>
    </SwipeableDrawer>
  );
}

export default SwipeableEdgeDrawer;
