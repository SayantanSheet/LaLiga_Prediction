from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import sys
import os

# Add scripts directory to path to import scraping logic if needed
# scraper is now in the same directory (backend), so direct import works
import scraper

from predictor import PredictionEngine

app = FastAPI(title="LaLiga Predictor API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, specficy the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = PredictionEngine()

class PredictionRequest(BaseModel):
    home_team: str
    away_team: str

@app.get("/")
def read_root():
    return {"status": "ok", "message": "LaLiga Predictor API is running"}

@app.get("/api/teams")
def get_teams():
    return {"teams": engine.get_teams()}

@app.get("/api/matches")
def get_matches():
    return {"matches": engine.matches}

@app.post("/api/predict")
def predict_match(request: PredictionRequest):
    try:
        result = engine.predict_match(request.home_team, request.away_team)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/refresh")
def refresh_data():
    try:
        scraper.main() # This updates the JSON file
        engine.load_data() # Reload data in engine
        return {"status": "success", "message": "Data refreshed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
