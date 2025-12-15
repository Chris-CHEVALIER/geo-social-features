// ==========================================
// SÉLECTION DES ÉLÉMENTS DU DOM
// ==========================================

const drawer = document.getElementById('drawer');
const overlay = document.getElementById('overlay');
const openDrawerBtn = document.getElementById('openDrawerBtn');
const closeDrawerBtn = document.getElementById('closeDrawerBtn');
const drawerHandle = document.querySelector('.drawer-handle');

// ==========================================
// VARIABLES D'ÉTAT DU DRAWER
// ==========================================

let isOpen = false;           // Le drawer est-il ouvert ?
let isDragging = false;       // L'utilisateur est-il en train de glisser ?
let startY = 0;               // Position Y de départ du drag
let currentY = 0;             // Position Y actuelle du drag
let drawerHeight = 0;         // Hauteur du drawer

// ==========================================
// FONCTION : OUVRIR LE DRAWER
// ==========================================

function openDrawer() {
    isOpen = true;
    drawer.classList.add('open');
    overlay.classList.add('active');
}

// ==========================================
// FONCTION : FERMER LE DRAWER
// ==========================================

function closeDrawer() {
    isOpen = false;
    drawer.classList.remove('open');
    overlay.classList.remove('active');
}

// ==========================================
// GESTION DES BOUTONS
// ==========================================

// Bouton pour ouvrir le drawer
openDrawerBtn.addEventListener('click', openDrawer);

// Bouton pour fermer le drawer
closeDrawerBtn.addEventListener('click', closeDrawer);

// Clic sur l'overlay pour fermer le drawer
overlay.addEventListener('click', closeDrawer);

// ==========================================
// GESTION DU DRAG/SWIPE
// ==========================================

// --------------------------------------------
// DÉBUT DU DRAG (souris ou touch)
// --------------------------------------------

function handleDragStart(event) {
    // Récupère la position Y de départ
    startY = event.type === 'touchstart' ? event.touches[0].clientY : event.clientY;

    // Active le mode dragging
    isDragging = true;

    // Récupère la hauteur actuelle du drawer
    drawerHeight = drawer.offsetHeight;

    // Désactive la transition CSS pendant le drag pour un mouvement fluide
    drawer.classList.add('dragging');
}

// --------------------------------------------
// PENDANT LE DRAG (souris ou touch)
// --------------------------------------------

function handleDragMove(event) {
    // Si on n'est pas en mode drag, on arrête
    if (!isDragging) return;

    // Empêche le comportement par défaut (scroll de la page)
    event.preventDefault();

    // Récupère la position Y actuelle
    currentY = event.type === 'touchmove' ? event.touches[0].clientY : event.clientY;

    // Calcule la différence entre la position de départ et la position actuelle
    const deltaY = currentY - startY;

    // Si le drawer est ouvert, on peut le glisser vers le bas
    if (isOpen) {
        // On ne déplace que si on glisse vers le bas (deltaY positif)
        if (deltaY > 0) {
            // Applique le déplacement au drawer
            drawer.style.transform = `translateY(${deltaY}px)`;
        }
    }
    // Si le drawer est fermé, on peut le glisser vers le haut
    else {
        // On ne déplace que si on glisse vers le haut (deltaY négatif)
        if (deltaY < 0) {
            // Calcule le nouveau translateY (la hauteur du drawer + le déplacement)
            const newTranslateY = drawerHeight + deltaY;
            drawer.style.transform = `translateY(${newTranslateY}px)`;
        }
    }
}

// --------------------------------------------
// FIN DU DRAG (souris ou touch)
// --------------------------------------------

function handleDragEnd() {
    // Si on n'était pas en mode drag, on arrête
    if (!isDragging) return;

    // Désactive le mode dragging
    isDragging = false;

    // Réactive la transition CSS pour une animation fluide
    drawer.classList.remove('dragging');

    // Calcule la distance parcourue
    const deltaY = currentY - startY;

    // Définit un seuil : si on a glissé de plus de 100px, on change l'état
    const threshold = 100;

    // Si le drawer est ouvert
    if (isOpen) {
        // Si on a glissé vers le bas de plus de 100px, on ferme
        if (deltaY > threshold) {
            closeDrawer();
        } else {
            // Sinon, on réouvre (retour à la position initiale)
            drawer.style.transform = '';
        }
    }
    // Si le drawer est fermé
    else {
        // Si on a glissé vers le haut de plus de 100px, on ouvre
        if (deltaY < -threshold) {
            openDrawer();
        } else {
            // Sinon, on referme (retour à la position initiale)
            drawer.style.transform = '';
        }
    }

    // Réinitialise le transform inline après la transition
    setTimeout(() => {
        drawer.style.transform = '';
    }, 300);
}

// ==========================================
// ÉCOUTEURS D'ÉVÉNEMENTS POUR LE DRAG
// ==========================================

// --- SOURIS ---
drawerHandle.addEventListener('mousedown', handleDragStart);
document.addEventListener('mousemove', handleDragMove);
document.addEventListener('mouseup', handleDragEnd);

// --- TOUCH (mobile/tablette) ---
drawerHandle.addEventListener('touchstart', handleDragStart, { passive: false });
document.addEventListener('touchmove', handleDragMove, { passive: false });
document.addEventListener('touchend', handleDragEnd);

// ==========================================
// BONUS : GESTION DU CLAVIER (accessibilité)
// ==========================================

// Fermer le drawer avec la touche Échap
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen) {
        closeDrawer();
    }
});
