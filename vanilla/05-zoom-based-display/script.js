// ========================================
// ÉTAPE 1 : Initialisation de la carte Leaflet
// ========================================

// Créer la carte et la centrer sur Paris avec un zoom initial de 11
const map = L.map('map').setView([48.8566, 2.3522], 11);

// Ajouter la couche de tuiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
    minZoom: 3
}).addTo(map);

// ========================================
// ÉTAPE 2 : Définir les seuils de zoom
// ========================================

/**
 * Seuils de zoom pour afficher différents niveaux d'information
 * Ces valeurs peuvent être ajustées selon vos besoins
 */
const ZOOM_THRESHOLDS = {
    GENERAL_MAX: 11,        // Zoom <= 11 : vue générale
    INTERMEDIATE_MIN: 12,   // Zoom >= 12 : vue intermédiaire commence
    INTERMEDIATE_MAX: 14,   // Zoom <= 14 : vue intermédiaire se termine
    DETAILED_MIN: 15        // Zoom >= 15 : vue détaillée
};

// ========================================
// ÉTAPE 3 : Créer les groupes de marqueurs (LayerGroups)
// ========================================

/**
 * LayerGroup = groupe de marqueurs qu'on peut ajouter/retirer ensemble
 * Chaque groupe représente un niveau de zoom
 */

// Groupe 1 : Grandes villes (zoom général)
const generalLayer = L.layerGroup();

// Grandes villes de France
const cities = [
    { name: 'Paris', coords: [48.8566, 2.3522], info: 'Capitale de la France' },
    { name: 'Lyon', coords: [45.7640, 4.8357], info: 'Deuxième ville de France' },
    { name: 'Marseille', coords: [43.2965, 5.3698], info: 'Troisième ville de France' },
    { name: 'Toulouse', coords: [43.6047, 1.4442], info: 'Ville rose' },
    { name: 'Nice', coords: [43.7102, 7.2620], info: 'Capitale de la Côte d\'Azur' }
];

cities.forEach(city => {
    const marker = L.marker(city.coords, {
        icon: createCustomIcon('#3498db') // Bleu
    });
    marker.bindPopup(`<strong>${city.name}</strong><p>${city.info}</p>`);
    generalLayer.addLayer(marker);
});

// Groupe 2 : Quartiers de Paris (zoom intermédiaire)
const intermediateLayer = L.layerGroup();

const districts = [
    { name: 'Le Marais', coords: [48.8575, 2.3626], info: 'Quartier historique' },
    { name: 'Montmartre', coords: [48.8867, 2.3431], info: 'Quartier des artistes' },
    { name: 'Quartier Latin', coords: [48.8503, 2.3439], info: 'Quartier étudiant' },
    { name: 'Saint-Germain', coords: [48.8534, 2.3326], info: 'Quartier chic' },
    { name: 'La Défense', coords: [48.8920, 2.2388], info: 'Quartier d\'affaires' }
];

districts.forEach(district => {
    const marker = L.marker(district.coords, {
        icon: createCustomIcon('#f39c12') // Orange
    });
    marker.bindPopup(`<strong>${district.name}</strong><p>${district.info}</p>`);
    intermediateLayer.addLayer(marker);
});

// Groupe 3 : Points d'intérêt détaillés (zoom élevé)
const detailedLayer = L.layerGroup();

const pois = [
    { name: 'Tour Eiffel', coords: [48.8584, 2.2945], info: 'Monument emblématique' },
    { name: 'Louvre', coords: [48.8606, 2.3376], info: 'Musée célèbre' },
    { name: 'Notre-Dame', coords: [48.8530, 2.3499], info: 'Cathédrale gothique' },
    { name: 'Arc de Triomphe', coords: [48.8738, 2.2950], info: 'Monument historique' },
    { name: 'Sacré-Cœur', coords: [48.8867, 2.3431], info: 'Basilique' },
    { name: 'Champs-Élysées', coords: [48.8698, 2.3078], info: 'Avenue célèbre' },
    { name: 'Musée d\'Orsay', coords: [48.8600, 2.3266], info: 'Musée impressionniste' },
    { name: 'Panthéon', coords: [48.8462, 2.3464], info: 'Monument néoclassique' }
];

pois.forEach(poi => {
    const marker = L.marker(poi.coords, {
        icon: createCustomIcon('#e74c3c') // Rouge
    });
    marker.bindPopup(`<strong>${poi.name}</strong><p>${poi.info}</p>`);
    detailedLayer.addLayer(marker);
});

// ========================================
// ÉTAPE 4 : Fonction pour créer des icônes personnalisées
// ========================================

/**
 * Crée une icône de marqueur avec une couleur personnalisée
 * @param {string} color - Couleur hexadécimale (ex: '#3498db')
 * @returns {L.DivIcon} Icône Leaflet personnalisée
 */
function createCustomIcon(color) {
    return L.divIcon({
        className: 'custom-marker',
        html: `<div style="
            background-color: ${color};
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });
}

// ========================================
// ÉTAPE 5 : Fonction principale de mise à jour des couches
// ========================================

/**
 * Met à jour l'affichage des couches en fonction du niveau de zoom
 */
function updateLayersBasedOnZoom() {
    // Récupérer le niveau de zoom actuel
    const currentZoom = map.getZoom();

    // Logger pour le debug
    console.log('Niveau de zoom actuel:', currentZoom);

    // RÈGLE 1 : Vue générale (zoom <= 11)
    if (currentZoom <= ZOOM_THRESHOLDS.GENERAL_MAX) {
        // Afficher uniquement les grandes villes
        if (!map.hasLayer(generalLayer)) {
            map.addLayer(generalLayer);
        }
        map.removeLayer(intermediateLayer);
        map.removeLayer(detailedLayer);

        updateZoomUI(currentZoom, 'Vue générale de la région');
    }

    // RÈGLE 2 : Vue intermédiaire (zoom 12-14)
    else if (currentZoom >= ZOOM_THRESHOLDS.INTERMEDIATE_MIN &&
             currentZoom <= ZOOM_THRESHOLDS.INTERMEDIATE_MAX) {
        // Afficher villes + quartiers
        if (!map.hasLayer(generalLayer)) {
            map.addLayer(generalLayer);
        }
        if (!map.hasLayer(intermediateLayer)) {
            map.addLayer(intermediateLayer);
        }
        map.removeLayer(detailedLayer);

        updateZoomUI(currentZoom, 'Vue intermédiaire - Quartiers visibles');
    }

    // RÈGLE 3 : Vue détaillée (zoom >= 15)
    else if (currentZoom >= ZOOM_THRESHOLDS.DETAILED_MIN) {
        // Afficher toutes les couches
        if (!map.hasLayer(generalLayer)) {
            map.addLayer(generalLayer);
        }
        if (!map.hasLayer(intermediateLayer)) {
            map.addLayer(intermediateLayer);
        }
        if (!map.hasLayer(detailedLayer)) {
            map.addLayer(detailedLayer);
        }

        updateZoomUI(currentZoom, 'Vue détaillée - Tous les points d\'intérêt');
    }
}

// ========================================
// ÉTAPE 6 : Mise à jour de l'interface utilisateur
// ========================================

/**
 * Met à jour l'affichage de l'indicateur de zoom
 * @param {number} zoom - Niveau de zoom actuel
 * @param {string} description - Description textuelle du niveau
 */
function updateZoomUI(zoom, description) {
    const zoomElement = document.getElementById('currentZoom');
    const descriptionElement = document.getElementById('zoomDescription');

    // Mettre à jour les valeurs
    zoomElement.textContent = zoom;
    descriptionElement.textContent = description;

    // Ajouter une animation pour attirer l'attention
    zoomElement.classList.add('update');
    setTimeout(() => {
        zoomElement.classList.remove('update');
    }, 300);
}

// ========================================
// ÉTAPE 7 : Écouter les événements de zoom
// ========================================

/**
 * L'événement 'zoomend' est déclenché quand le zoom est terminé
 * (pas pendant que l'utilisateur zoome, mais après)
 */
map.on('zoomend', function() {
    updateLayersBasedOnZoom();
});

// Événement optionnel : pendant le zoom (peut être utile)
map.on('zoom', function() {
    const currentZoom = map.getZoom();
    document.getElementById('currentZoom').textContent = currentZoom;
});

// ========================================
// ÉTAPE 8 : Initialisation au chargement
// ========================================

// Appeler la fonction une première fois pour afficher les bonnes couches
// en fonction du zoom initial
updateLayersBasedOnZoom();

// ========================================
// NOTES PÉDAGOGIQUES
// ========================================

/*
1. NIVEAUX DE ZOOM LEAFLET
   - Le zoom va de 0 (monde entier) à 19 (rue détaillée)
   - Chaque niveau de zoom double la résolution
   - Zoom 11 = région, 13 = ville, 15 = quartier, 18 = bâtiment

2. ÉVÉNEMENT 'zoomend'
   - Déclenché après chaque changement de zoom
   - Différent de 'zoom' qui se déclenche pendant l'animation
   - Plus performant car appelé moins souvent

3. LAYERGROUP
   - Permet de grouper plusieurs marqueurs ensemble
   - On peut les ajouter/retirer de la carte en une seule opération
   - Très utile pour gérer différents niveaux de détail

4. POURQUOI NE PAS TOUT AFFICHER ?
   - Performance : trop de marqueurs ralentissent la carte
   - Lisibilité : évite la surcharge visuelle
   - UX : l'utilisateur voit ce qui est pertinent à son niveau de zoom

5. MÉTHODE map.hasLayer()
   - Vérifie si une couche est déjà sur la carte
   - Évite d'ajouter plusieurs fois la même couche
   - Important pour la performance

6. RÉUTILISATION
   - Adaptez les seuils ZOOM_THRESHOLDS à votre cas d'usage
   - Créez vos propres LayerGroups avec vos données
   - Vous pouvez avoir plus de 3 niveaux si nécessaire
*/
