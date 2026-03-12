import { useState, useEffect } from 'react'
import './App.css'

// Definiamo cosa ci aspettiamo dal backend
interface TechData {
  titolo: string;
  messaggio: string;
  news: string[];
}

function App() {
  const [data, setData] = useState<TechData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Chiamata al server Python
    fetch('http://127.0.0.1:8000/api/info')
      .then(response => response.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(error => {
        console.error("Errore nel recupero dati:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="App">
      <header style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Tech Portal v1.0</h1>
        
        {loading ? (
          <p>Caricamento dati dal server Python...</p>
        ) : data ? (
          <div style={{ border: '1px solid #646cff', padding: '20px', borderRadius: '8px' }}>
            <h2>{data.titolo}</h2>
            <p>{data.messaggio}</p>
            <hr />
            <h3>Ultime dal mondo IT:</h3>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {data.news.map((item, index) => (
                <li key={index} style={{ margin: '10px 0', color: '#646cff' }}>
                  • {item}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>Errore: Il backend non risponde.</p>
        )}
      </header>
    </div>
  )
}

export default App