from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests # type: ignore

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/search")
def search_news(q: str = ""):
    if not q:
        return get_detailed_news() # Se non c'è query, diamo le top news
    
    try:
        # Cerchiamo su Algolia Hacker News API
        response = requests.get(f"https://hn.algolia.com/api/v1/search?query={q}&tags=story&hitsPerPage=10")
        results = response.json().get("hits", [])
        
        search_results = []
        for item in results:
            search_results.append({
                "id": item.get("objectID"),
                "title": item.get("title"),
                "url": item.get("url") or f"https://news.ycombinator.com/item?id={item.get('objectID')}",
                "score": item.get("points", 0),
                "by": item.get("author", "unknown")
            })
        return search_results
    except Exception as e:
        return [{"title": f"Errore ricerca: {e}", "url": "#", "score": 0, "by": "system"}]

def get_detailed_news(limit=5):
    try:
        top_ids = requests.get("https://hacker-news.firebaseio.com/v0/topstories.json").json()[:limit]
        detailed_news = []
        for story_id in top_ids:
            data = requests.get(f"https://hacker-news.firebaseio.com/v0/item/{story_id}.json").json()
            detailed_news.append({
                "id": data.get("id"),
                "title": data.get("title"),
                "url": data.get("url", f"https://news.ycombinator.com/item?id={story_id}"),
                "score": data.get("score", 0),
                "by": data.get("by", "unknown")
            })
        return detailed_news
    except Exception as e:
        return [{"title": f"Errore: {e}", "url": "#", "score": 0, "by": "system"}]

@app.get("/api/news")
def read_news():
    return get_detailed_news()

@app.get("/api/bot/{command}")
def bot_commands(command: str):
    # Logica stile Bot di Discord
    if command == "status":
        return {"response": "🟢 Sistema operativo. Python 3.14.3 in esecuzione."}
    elif command == "help":
        return {"response": "Comandi disponibili: /status, /news, /about"}
    else:
        return {"response": f"Comando '{command}' non riconosciuto. Scrivi /help."}