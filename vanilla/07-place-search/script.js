// ============================================
// RECHERCHE DE LIEU AVEC GÉOCODAGE NOMINATIM
// ============================================

// === 1. INITIALISATION DE LA CARTE ===

// Création de la carte Leaflet centrée sur la France par défaut
const map = L.map('map').setView([46.603354, 1.888334], 6);

// Ajout de la couche de tuiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
}).addTo(map);

// Variable pour stocker le marqueur actuel
let currentMarker = null;

// === 2. RÉCUPÉRATION DES ÉLÉMENTS DU DOM ===

const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const messageDiv = document.getElementById('message');

// === 3. FONCTION D'AFFICHAGE DES MESSAGES ===

/**
 * Affiche un message à l'utilisateur
 * @param {string} text - Le texte du message
 * @param {string} type - Le type de message (success, error, info)
 */
function showMessage(text, type = 'info') {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.classList.remove('hidden');
}

/**
 * Cache le message
 */
function hideMessage() {
    messageDiv.classList.add('hidden');
}

// === 4. FONCTION DE GÉOCODAGE ===

/**
 * Recherche un lieu via l'API Nominatim d'OpenStreetMap
 * @param {string} query - Le nom du lieu recherché
 * @returns {Promise} Les données de géocodage
 */
async function searchPlace(query) {
    // URL de l'API Nominatim
    // format=json : on veut une réponse JSON
    // limit=1 : on ne veut que le meilleur résultat
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;

    try {
        // Appel à l'API avec fetch
        // Note pédagogique : Nominatim demande un User-Agent pour identifier l'application
        // En production, vous devriez ajouter un header avec votre email ou nom d'app
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Educational Leaflet App - Student Project'
            }
        });

        // Vérification que la requête a réussi
        if (!response.ok) {
            throw new Error('Erreur réseau lors de la recherche');
        }

        // Conversion de la réponse en JSON
        const data = await response.json();

        // Nominatim renvoie un tableau vide si aucun résultat
        if (data.length === 0) {
            return null;
        }

        // On retourne le premier (et seul) résultat
        return data[0];

    } catch (error) {
        console.error('Erreur de géocodage:', error);
        throw error;
    }
}

// === 5. FONCTION DE MISE À JOUR DE LA CARTE ===

/**
 * Centre la carte sur un lieu et ajoute un marqueur
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} name - Nom du lieu
 */
function updateMap(lat, lon, name) {
    // Suppression de l'ancien marqueur s'il existe
    if (currentMarker) {
        map.removeLayer(currentMarker);
    }

    // Création d'un nouveau marqueur avec popup
    currentMarker = L.marker([lat, lon]).addTo(map);
    currentMarker.bindPopup(`<strong>${name}</strong>`).openPopup();

    // Centrage de la carte sur le lieu avec un zoom adapté
    map.setView([lat, lon], 13);
}

// === 6. GESTION DU FORMULAIRE ===

/**
 * Gère la soumission du formulaire de recherche
 */
searchForm.addEventListener('submit', async (event) => {
    // Empêche le rechargement de la page
    event.preventDefault();

    // Récupération et nettoyage de la saisie utilisateur
    const query = searchInput.value.trim();

    // Vérification que le champ n'est pas vide
    if (!query) {
        showMessage('Veuillez entrer un lieu à rechercher', 'error');
        return;
    }

    // Désactivation du bouton pendant la recherche
    searchButton.disabled = true;
    searchButton.textContent = 'Recherche...';
    hideMessage();

    try {
        // Appel de la fonction de géocodage
        const result = await searchPlace(query);

        // Si aucun résultat n'est trouvé
        if (!result) {
            showMessage(`Aucun résultat trouvé pour "${query}". Essayez une recherche plus précise.`, 'error');
            return;
        }

        // Extraction des données importantes
        const lat = parseFloat(result.lat);
        const lon = parseFloat(result.lon);
        const name = result.display_name;

        // Mise à jour de la carte
        updateMap(lat, lon, name);

        // Message de succès
        showMessage(`✓ Lieu trouvé : ${name}`, 'success');

    } catch (error) {
        // Gestion des erreurs
        showMessage('Erreur lors de la recherche. Vérifiez votre connexion internet.', 'error');
        console.error('Erreur:', error);

    } finally {
        // Réactivation du bouton dans tous les cas
        searchButton.disabled = false;
        searchButton.textContent = 'Rechercher';
    }
});

// === 7. AMÉLIORATION UX : RECHERCHE EN APPUYANT SUR ENTRÉE ===

// Le formulaire gère déjà la touche Entrée via l'événement submit
// Pas besoin de code supplémentaire ici !

// === 8. MESSAGE DE BIENVENUE ===

showMessage('Entrez un lieu dans le champ de recherche ci-dessus', 'info');
