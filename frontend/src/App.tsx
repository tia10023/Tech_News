import { useState, useEffect } from 'react'
import './App.css'

interface NewsItem {
  id: number;
  title: string;
  url: string;
  score: number;
  by: string;
}

function App() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [command, setCommand] = useState("");
  const [botResponse, setBotResponse] = useState("Scrivi una parola chiave (es: Python) per cercare...");

  // Carica le news top all'avvio
  useEffect(() => {
    fetch('http://localhost:8000/api/news')
      .then(res => res.json())
      .then(data => setNews(data));
  }, []);

  // Gestione della ricerca (comportamento dinamico)
  const handleBotCommand = async () => {
    const input = command.trim();
    if (!input) return;

    // Gestione comandi speciali (es: status)
    if (input.startsWith('/status')) {
      const res = await fetch(`http://localhost:8000/api/bot/status`);
      const data = await res.json();
      setBotResponse(data.response);
    } 
    // Altrimenti, trattalo come una ricerca di news
    else {
      setBotResponse(`🔍 Ricerca per: "${input}"...`);
      try {
        const res = await fetch(`http://localhost:8000/api/search?q=${input}`);
        const data = await res.json();
        setNews(data); // Aggiorna la griglia con i risultati
        setBotResponse(`✅ Trovati ${data.length} risultati per "${input}"`);
      } catch (error) {
        setBotResponse("❌ Errore nella ricerca");
      }
    }
    setCommand("");
  };

  return (
    <div className="App">
      <header>
        <h1>🤖 Tech News Portal</h1>
        <p className="subtitle">Il tuo aggregatore di notizie IT con un tocco di dolcezza.</p>
      </header>

      {/* Barra di Ricerca e Bot (Layout Innovativo) */}
      <div className="search-container">
        <p style={{ minWidth: '200px', color: botResponse.startsWith('❌') ? 'red' : botResponse.startsWith('✅') ? 'green' : '#666', fontSize: '0.9rem' }}>
          {botResponse}
        </p>
        <input 
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Cerca 'React', 'OpenAI'..."
          onKeyDown={(e) => e.key === 'Enter' && handleBotCommand()}
        />
        <button onClick={handleBotCommand}>Cerca</button>
      </div>

      {/* Griglia delle News */}
      <div className="news-grid">
        {news.map(item => (
          <div key={item.id} className="news-card">
            <a href={item.url} target="_blank" rel="noreferrer">
              {item.title}
            </a>
            <div className="news-card-info">
              <span className="score-badge">Points: {item.score}</span>
              Autore: <span className="author-name">{item.by}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App