// ========================================
// ÉTAPE 1 : Initialisation de la carte Leaflet
// ========================================

// Créer la carte et la centrer sur Paris
// setView([latitude, longitude], niveau_de_zoom)
const map = L.map('map').setView([48.8566, 2.3522], 13);

// Ajouter la couche de tuiles OpenStreetMap
// Cette ligne télécharge les images de la carte depuis les serveurs OSM
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
}).addTo(map);

// ========================================
// ÉTAPE 2 : Récupérer les éléments du DOM
// ========================================

// Récupérer la modale et ses éléments
const modal = document.getElementById('modal');
const latitudeElement = document.getElementById('latitude');
const longitudeElement = document.getElementById('longitude');
const closeModalButton = document.getElementById('closeModal');
const closeModalFooterButton = document.getElementById('closeModalFooter');

// ========================================
// ÉTAPE 3 : Fonction pour ouvrir la modale
// ========================================

/**
 * Ouvre la modale et affiche les coordonnées
 * @param {number} lat - Latitude du point cliqué
 * @param {number} lng - Longitude du point cliqué
 */
function openModal(lat, lng) {
    // Formater les coordonnées avec 6 décimales
    const latFormatted = lat.toFixed(6);
    const lngFormatted = lng.toFixed(6);

    // Mettre à jour le contenu de la modale
    latitudeElement.textContent = latFormatted;
    longitudeElement.textContent = lngFormatted;

    // Afficher la modale en ajoutant la classe 'show'
    modal.classList.add('show');
}

// ========================================
// ÉTAPE 4 : Fonction pour fermer la modale
// ========================================

/**
 * Ferme la modale
 */
function closeModal() {
    // Cacher la modale en retirant la classe 'show'
    modal.classList.remove('show');
}

// ========================================
// ÉTAPE 5 : Écouter le clic sur la carte
// ========================================

/**
 * Leaflet déclenche un événement 'click' quand on clique sur la carte
 * L'objet événement contient une propriété 'latlng' avec les coordonnées
 */
map.on('click', function(event) {
    // event.latlng est un objet Leaflet contenant :
    // - lat : la latitude
    // - lng : la longitude

    const latitude = event.latlng.lat;
    const longitude = event.latlng.lng;

    // Afficher les coordonnées dans la console (pour le debug)
    console.log('Clic sur la carte:', { latitude, longitude });

    // Ouvrir la modale avec les coordonnées
    openModal(latitude, longitude);
});

// ========================================
// ÉTAPE 6 : Écouter les clics sur les boutons de fermeture
// ========================================

// Bouton de fermeture dans le header (×)
closeModalButton.addEventListener('click', closeModal);

// Bouton "Fermer" dans le footer
closeModalFooterButton.addEventListener('click', closeModal);

// ========================================
// ÉTAPE 7 : Fermer la modale en cliquant sur le fond
// ========================================

/**
 * Permet de fermer la modale en cliquant en dehors du contenu
 * (sur le fond semi-transparent)
 */
modal.addEventListener('click', function(event) {
    // Si on clique directement sur la modale (le fond)
    // et pas sur son contenu, on la ferme
    if (event.target === modal) {
        closeModal();
    }
});

// ========================================
// ÉTAPE 8 : Fermer la modale avec la touche Échap
// ========================================

/**
 * Améliore l'expérience utilisateur en permettant
 * de fermer la modale avec la touche Escape
 */
document.addEventListener('keydown', function(event) {
    // Si la modale est visible ET que la touche Escape est pressée
    if (modal.classList.contains('show') && event.key === 'Escape') {
        closeModal();
    }
});

// ========================================
// NOTES PÉDAGOGIQUES
// ========================================

/*
1. ÉVÉNEMENT CLICK DE LEAFLET
   - Leaflet écoute tous les clics sur la carte
   - Il crée un objet événement avec les coordonnées exactes
   - event.latlng.lat = latitude
   - event.latlng.lng = longitude

2. STRUCTURE DE LA MODALE
   - La modale est cachée par défaut (display: none)
   - On ajoute la classe 'show' pour l'afficher (display: flex)
   - On retire la classe 'show' pour la cacher

3. BONNES PRATIQUES
   - Utiliser des fonctions séparées (openModal, closeModal)
   - Toujours formater les nombres décimaux (toFixed)
   - Offrir plusieurs façons de fermer la modale (×, bouton, Échap, clic extérieur)
   - Logger dans la console pour faciliter le debug

4. RÉUTILISATION
   - Cette logique peut être réutilisée pour n'importe quelle action au clic
   - Remplacer openModal() par votre propre fonction
   - Exemples : ajouter un marqueur, sauvegarder en base, etc.
*/
