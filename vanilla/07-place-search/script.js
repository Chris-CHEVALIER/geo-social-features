// ============================================
// INITIALISATION DE LA CARTE
// ============================================

// Création de la carte centrée sur la France par défaut
const map = L.map('map').setView([46.603354, 1.888334], 6);

// Ajout de la couche de tuiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
}).addTo(map);

// Variable pour stocker le marqueur de recherche
// On la déclare ici pour pouvoir le supprimer et le remplacer à chaque nouvelle recherche
let searchMarker = null;

// ============================================
// FONCTION DE RECHERCHE DE LIEU
// ============================================

/**
 * Recherche un lieu via l'API Nominatim d'OpenStreetMap
 * @param {string} query - Le nom du lieu à rechercher
 */
async function searchPlace(query) {
    // URL de l'API Nominatim
    // format=json : pour recevoir une réponse en JSON
    // limit=1 : on ne veut que le premier résultat (le plus pertinent)
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;

    try {
        // Appel à l'API avec fetch
        // BONNE PRATIQUE : Nominatim demande d'identifier son application
        // Pour un usage étudiant/prototype, un User-Agent simple suffit
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'GeoSocialFeaturesDemo/1.0 (Educational purpose)'
            }
        });

        // Vérification que la requête s'est bien passée
        if (!response.ok) {
            throw new Error('Erreur lors de la recherche');
        }

        // Conversion de la réponse en JSON
        const data = await response.json();

        // Vérification qu'on a au moins un résultat
        if (data.length === 0) {
            showMessage('Aucun résultat trouvé. Essayez avec un autre nom de lieu.', 'error');
            return;
        }

        // Récupération du premier résultat
        const place = data[0];

        // Extraction des coordonnées (latitude et longitude)
        const lat = parseFloat(place.lat);
        const lon = parseFloat(place.lon);
        const displayName = place.display_name;

        // Mise à jour de la carte et ajout du marqueur
        updateMap(lat, lon, displayName);

        // Message de succès
        showMessage(`Lieu trouvé : ${displayName}`, 'success');

    } catch (error) {
        // Gestion des erreurs (problème réseau, API indisponible, etc.)
        console.error('Erreur:', error);
        showMessage('Erreur lors de la recherche. Vérifiez votre connexion internet.', 'error');
    }
}

// ============================================
// FONCTION DE MISE À JOUR DE LA CARTE
// ============================================

/**
 * Centre la carte sur les coordonnées trouvées et ajoute un marqueur
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} name - Nom du lieu pour le popup
 */
function updateMap(lat, lon, name) {
    // Si un marqueur existe déjà, on le supprime
    if (searchMarker) {
        map.removeLayer(searchMarker);
    }

    // Centrage de la carte sur le lieu trouvé avec un zoom adapté
    map.setView([lat, lon], 13);

    // Création d'un nouveau marqueur
    searchMarker = L.marker([lat, lon]).addTo(map);

    // Ajout d'un popup avec le nom du lieu
    searchMarker.bindPopup(`<strong>${name}</strong>`).openPopup();
}

// ============================================
// FONCTION D'AFFICHAGE DES MESSAGES
// ============================================

/**
 * Affiche un message à l'utilisateur
 * @param {string} message - Le texte du message
 * @param {string} type - Le type : 'success', 'error', 'info'
 */
function showMessage(message, type) {
    const messageDiv = document.getElementById('searchMessage');
    messageDiv.textContent = message;

    // Réinitialisation des classes
    messageDiv.className = 'message';

    // Ajout de la classe correspondant au type
    messageDiv.classList.add(type);
}

// ============================================
// GESTION DU FORMULAIRE
// ============================================

// Récupération du formulaire
const searchForm = document.getElementById('searchForm');

// Écoute de la soumission du formulaire
searchForm.addEventListener('submit', (event) => {
    // Empêche le rechargement de la page
    event.preventDefault();

    // Récupération de la valeur saisie par l'utilisateur
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();

    // Vérification que le champ n'est pas vide
    if (query === '') {
        showMessage('Veuillez entrer un lieu à rechercher.', 'error');
        return;
    }

    // Message d'attente pendant la recherche
    showMessage('Recherche en cours...', 'info');

    // Lancement de la recherche
    searchPlace(query);
});
