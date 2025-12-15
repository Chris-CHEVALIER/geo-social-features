import React from 'react';
import { SwipeableDrawer, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// 📌 Composant Drawer qui s'ouvre depuis le bas de l'écran
// Il reçoit 3 props (propriétés) de son parent (App.jsx) :
//   - open : true si ouvert, false si fermé
//   - onOpen : fonction à appeler quand on ouvre
//   - onClose : fonction à appeler quand on ferme
function SwipeableEdgeDrawer({ open, onOpen, onClose }) {
  return (
    <SwipeableDrawer
      anchor="bottom"              // Le drawer sort du bas de l'écran
      open={open}                  // État : ouvert ou fermé
      onOpen={onOpen}              // Fonction appelée à l'ouverture
      onClose={onClose}            // Fonction appelée à la fermeture
      swipeAreaWidth={56}          // Taille de la zone swipeable (en pixels)
      disableSwipeToOpen={false}   // Active le swipe pour ouvrir
      ModalProps={{
        keepMounted: true,         // Garde le drawer en mémoire pour de meilleures performances
      }}
    >
      {/* 📌 PARTIE 1 : Petite barre en haut du drawer */}
      <Box
        sx={{
          position: 'absolute',        // Positionnement absolu
          top: -56,                    // 56px au-dessus du drawer
          borderTopLeftRadius: 8,      // Coins arrondis en haut à gauche
          borderTopRightRadius: 8,     // Coins arrondis en haut à droite
          right: 0,
          left: 0,
          backgroundColor: 'white',
          height: 56,                  // Hauteur de 56px
          display: 'flex',
          justifyContent: 'center',    // Centre horizontalement
          alignItems: 'center',        // Centre verticalement
        }}
      >
        {/* Petite barre grise = indicateur visuel pour le swipe */}
        <Box
          sx={{
            width: 40,                 // Largeur de 40px
            height: 4,                 // Hauteur de 4px
            backgroundColor: 'grey',   // Couleur grise
            borderRadius: 2,           // Coins arrondis
          }}
        />
      </Box>

      {/* 📌 PARTIE 2 : Contenu principal du drawer */}
      <Box
        sx={{
          padding: '32px 24px',        // Espacement intérieur (haut/bas puis gauche/droite)
          height: '50vh',              // Hauteur = 50% de la hauteur de l'écran
          overflow: 'auto',            // Ajoute un scroll si le contenu dépasse
          backgroundColor: 'white',
        }}
      >
        {/* Bouton X pour fermer */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
          <IconButton onClick={onClose} aria-label="Fermer">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Titre */}
        <Typography variant="h5" component="h2" gutterBottom>
          Contenu du Drawer
        </Typography>

        {/* Texte d'explication */}
        <Typography variant="body1" paragraph>
          Ce drawer peut être ouvert de plusieurs façons :
        </Typography>

        <Typography variant="body2" component="ul" sx={{ paddingLeft: 2 }}>
          <li>En cliquant sur le bouton "Ouvrir le drawer"</li>
          <li>En swipant vers le haut depuis le bas de l'écran</li>
          <li>En cliquant sur la petite barre grise en bas</li>
        </Typography>

        <Typography variant="body1" paragraph sx={{ marginTop: 3 }}>
          Vous pouvez le fermer :
        </Typography>

        <Typography variant="body2" component="ul" sx={{ paddingLeft: 2 }}>
          <li>En cliquant sur l'icône X en haut à droite</li>
          <li>En swipant vers le bas</li>
          <li>En cliquant en dehors du drawer (sur le fond sombre)</li>
        </Typography>

        {/* Encadré avec astuce */}
        <Box sx={{ marginTop: 4, padding: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            💡 Vous pouvez personnaliser ce contenu : ajoutez des formulaires, des listes, des images, etc.
          </Typography>
        </Box>
      </Box>
    </SwipeableDrawer>
  );
}

export default SwipeableEdgeDrawer;
