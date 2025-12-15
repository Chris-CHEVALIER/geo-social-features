/**
 * Page Carte
 *
 * Cette page s'affiche quand on navigue vers la route "/map"
 * Elle représente une page qui pourrait afficher une carte interactive
 */
function Map() {
  return (
    <div style={{
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto',
    }}>
      <h1 style={{
        fontSize: '24px',
        marginBottom: '20px',
        color: '#333',
      }}>
        Carte
      </h1>

      <p style={{
        lineHeight: '1.6',
        color: '#555',
        marginBottom: '15px',
      }}>
        Vous êtes maintenant sur la page Carte !
      </p>

      <p style={{
        lineHeight: '1.6',
        color: '#555',
        marginBottom: '15px',
      }}>
        Remarquez que la page a changé sans rechargement complet du navigateur.
        C'est le principe du routing côté client.
      </p>

      <div style={{
        backgroundColor: '#f0f0f0',
        padding: '40px',
        borderRadius: '8px',
        textAlign: 'center',
        marginTop: '20px',
        border: '2px dashed #ccc',
      }}>
        <p style={{ color: '#888', fontSize: '14px' }}>
          Ici, vous pourriez intégrer une carte interactive
          <br />
          (Leaflet, Google Maps, Mapbox, etc.)
        </p>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#fff8e1',
        borderRadius: '8px',
        border: '1px solid #ffe082',
      }}>
        <p style={{ color: '#f57c00', fontSize: '14px' }}>
          💡 Astuce : L'URL dans la barre d'adresse a changé vers "/map".
          Vous pouvez utiliser les boutons précédent/suivant du navigateur !
        </p>
      </div>
    </div>
  )
}

export default Map
