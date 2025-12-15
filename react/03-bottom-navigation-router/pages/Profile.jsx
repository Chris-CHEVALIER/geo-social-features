import { useState } from 'react'

/**
 * Page Profil
 *
 * Cette page s'affiche quand on navigue vers la route "/profile"
 * Elle montre qu'on peut utiliser des hooks (comme useState) dans nos pages
 */
function Profile() {
  // Exemple d'utilisation de useState dans une page
  const [username, setUsername] = useState('Jean Dupont')

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
        Profil
      </h1>

      <p style={{
        lineHeight: '1.6',
        color: '#555',
        marginBottom: '15px',
      }}>
        Bienvenue sur votre page de profil !
      </p>

      <div style={{
        backgroundColor: '#ffffff',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        marginTop: '20px',
      }}>
        <h3 style={{ marginBottom: '15px', color: '#333' }}>
          Informations du profil
        </h3>

        <div style={{ marginBottom: '15px' }}>
          <label style={{
            display: 'block',
            marginBottom: '5px',
            color: '#666',
            fontSize: '14px',
          }}>
            Nom d'utilisateur :
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <p style={{
          color: '#888',
          fontSize: '14px',
          marginTop: '10px',
        }}>
          Modifiez votre nom et naviguez vers une autre page :
          l'état sera perdu car le composant sera démonté.
        </p>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#e8f5e9',
        borderRadius: '8px',
        border: '1px solid #a5d6a7',
      }}>
        <p style={{ color: '#2e7d32', fontSize: '14px' }}>
          ✅ Cette page utilise useState : chaque page peut avoir son propre état local !
        </p>
      </div>
    </div>
  )
}

export default Profile
