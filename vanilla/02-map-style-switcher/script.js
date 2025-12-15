// ============================================
// 🗺️ CHANGEUR DE STYLE DE CARTE LEAFLET
// ============================================

// ────────────────────────────────────────────
// 1. INITIALISATION DE LA CARTE
// ────────────────────────────────────────────

// Coordonnées de Paris (latitude, longitude)
const parisCoords = [48.8566, 2.3522];

// On crée la carte et on la centre sur Paris avec un zoom de 12
const map = L.map('map').setView(parisCoords, 12);


// ────────────────────────────────────────────
// 2. DÉFINITION DES DIFFÉRENTS STYLES DE CARTE
// ────────────────────────────────────────────

// Qu'est-ce qu'un tileset ?
// Un tileset est un ensemble de "tuiles" (petites images carrées)
// qui sont assemblées pour former une carte complète.
// Chaque fournisseur propose son propre style visuel.

const mapStyles = {
    // Style standard d'OpenStreetMap (le plus connu)
    standard: {
        name: 'Standard',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '© OpenStreetMap contributors',
        layer: null // On stockera le layer Leaflet ici
    },

    // Style clair de Carto (idéal pour des cartes épurées)
    light: {
        name: 'Clair',
        url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        attribution: '© OpenStreetMap contributors © CARTO',
        layer: null
    },

    // Style sombre de Carto (parfait pour le mode nuit)
    dark: {
        name: 'Sombre',
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        attribution: '© OpenStreetMap contributors © CARTO',
        layer: null
    },

    // Style aquarelle de Stadia Maps (artistique et original)
    watercolor: {
        name: 'Aquarelle',
        url: 'https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg',
        attribution: '© Stadia Maps © Stamen Design © OpenStreetMap contributors',
        layer: null
    }
};


// ────────────────────────────────────────────
// 3. CRÉATION DES LAYERS LEAFLET
// ────────────────────────────────────────────

// Pour chaque style, on crée un layer Leaflet (une couche de carte)
// mais on ne l'ajoute pas encore à la carte
for (let styleKey in mapStyles) {
    const style = mapStyles[styleKey];

    // L.tileLayer() crée une couche de tuiles
    style.layer = L.tileLayer(style.url, {
        attribution: style.attribution,
        maxZoom: 19
    });
}


// ────────────────────────────────────────────
// 4. AFFICHAGE DU STYLE INITIAL (STANDARD)
// ────────────────────────────────────────────

// On ajoute le style standard à la carte au démarrage
let currentStyle = 'standard';
mapStyles[currentStyle].layer.addTo(map);


// ────────────────────────────────────────────
// 5. FONCTION POUR CHANGER DE STYLE
// ────────────────────────────────────────────

function changeMapStyle(newStyleKey) {
    // Si on clique sur le style déjà actif, on ne fait rien
    if (newStyleKey === currentStyle) {
        return;
    }

    // 1. On retire l'ancien layer de la carte
    map.removeLayer(mapStyles[currentStyle].layer);

    // 2. On ajoute le nouveau layer à la carte
    mapStyles[newStyleKey].layer.addTo(map);

    // 3. On met à jour la variable du style actif
    currentStyle = newStyleKey;

    // 4. On met à jour l'affichage du nom du style actif
    document.getElementById('current-style').textContent = mapStyles[newStyleKey].name;

    // 5. On met à jour les boutons (classe "active")
    updateActiveButton(newStyleKey);

    console.log(`✅ Style changé : ${mapStyles[newStyleKey].name}`);
}


// ────────────────────────────────────────────
// 6. FONCTION POUR METTRE À JOUR LE BOUTON ACTIF
// ────────────────────────────────────────────

function updateActiveButton(activeStyleKey) {
    // On récupère tous les boutons
    const buttons = document.querySelectorAll('.style-btn');

    // Pour chaque bouton...
    buttons.forEach(button => {
        const buttonStyle = button.getAttribute('data-style');

        // Si c'est le bouton du style actif, on ajoute la classe "active"
        if (buttonStyle === activeStyleKey) {
            button.classList.add('active');
        } else {
            // Sinon, on retire la classe "active"
            button.classList.remove('active');
        }
    });
}


// ────────────────────────────────────────────
// 7. ÉCOUTE DES CLICS SUR LES BOUTONS
// ────────────────────────────────────────────

// On récupère tous les boutons de style
const styleButtons = document.querySelectorAll('.style-btn');

// Pour chaque bouton, on ajoute un écouteur d'événement "click"
styleButtons.forEach(button => {
    button.addEventListener('click', function() {
        // On récupère le style associé au bouton (attribut data-style)
        const selectedStyle = this.getAttribute('data-style');

        // On change le style de la carte
        changeMapStyle(selectedStyle);
    });
});


// ────────────────────────────────────────────
// 8. MARQUEUR OPTIONNEL SUR PARIS
// ────────────────────────────────────────────

// On ajoute un marqueur sur Paris pour mieux visualiser
const marker = L.marker(parisCoords).addTo(map);
marker.bindPopup('<b>Paris</b><br>Changez le style de la carte ci-dessus !').openPopup();


// ────────────────────────────────────────────
// ✅ C'EST TOUT ! LA CARTE EST PRÊTE.
// ────────────────────────────────────────────

console.log('🗺️ Carte Leaflet initialisée avec succès');
console.log('🎨 Styles disponibles :', Object.keys(mapStyles));
