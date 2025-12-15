/**
 * Page d'accueil
 *
 * C'est la page qui s'affiche par défaut quand on arrive sur l'application (route "/")
 * Elle contient simplement du contenu textuel pour illustrer le principe.
 */
function Home() {
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
        Accueil
      </h1>

      <p style={{
        lineHeight: '1.6',
        color: '#555',
        marginBottom: '15px',
      }}>
        Bienvenue sur cette application de démonstration de React Router !
      </p>

      <p style={{
        lineHeight: '1.6',
        color: '#555',
        marginBottom: '15px',
      }}>
        Cette page est la page d'accueil. Utilisez la barre de navigation en bas
        pour naviguer entre les différentes pages de l'application.
      </p>

      <div style={{
        backgroundColor: '#f0f7ff',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid #d0e7ff',
      }}>
        <h3 style={{ marginBottom: '10px', color: '#0066cc' }}>
          Ce que vous allez apprendre :
        </h3>
        <ul style={{ lineHeight: '1.8', color: '#555' }}>
          <li>Comment configurer React Router</li>
          <li>Comment créer plusieurs pages</li>
          <li>Comment naviguer entre les pages sans rechargement</li>
          <li>Comment créer une barre de navigation fixe</li>
        </ul>
      </div>
    </div>
  )
}

export default Home
