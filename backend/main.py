from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# SICUREZZA: Senza questo, il browser bloccherà la comunicazione tra Front e Back
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In produzione metteremo l'indirizzo del sito
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/info")
def get_info():
    return {
        "titolo": "Benvenuto nel Mondo IT",
        "messaggio": "Questo dato arriva direttamente dal tuo backend Python!",
        "news": ["Python 3.12 è uscito", "TypeScript è fantastico", "FastAPI è veloce"]
    }