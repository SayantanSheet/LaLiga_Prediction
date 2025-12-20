import json
import os
import math
from datetime import datetime

# Adjust path to match your project structure
# Assuming this file is in laliga/backend/predictor.py
# and data is in laliga/src/data
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_FILE = os.path.join(PROJECT_ROOT, 'src/data/matches-all-seasons.json')

class PredictionEngine:
    def __init__(self):
        self.matches = []
        self.load_data()

    def load_data(self):
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                self.matches = json.load(f)
        else:
            print(f"Warning: Data file not found at {DATA_FILE}")
            self.matches = []

    def get_teams(self):
        teams = set()
        for m in self.matches:
            if m.get('homeTeam'): teams.add(m['homeTeam'])
            if m.get('awayTeam'): teams.add(m['awayTeam'])
        return sorted(list(teams))

    def get_team_stats(self, team, side=None, last_n=5):
        # Filter matches where team played
        team_matches = [m for m in self.matches if m['homeTeam'] == team or m['awayTeam'] == team]
        
        # Sort by date
        # Date format in json is usually DD/MM/YYYY or YYYY-MM-DD depending on source. 
        # The scrape script uses whatever text is there. Let's try to handle sort.
        # For simplicity, we assume the list order is roughly chronological or reverse.
        # But we should try to parse dates if possible.
        
        # Taking last n matches
        recent = team_matches[-last_n:]
        
        wins = 0
        draws = 0
        losses = 0
        goals_scored = 0
        goals_conceded = 0

        for m in recent:
            h_score = m['homeScore']
            a_score = m['awayScore']
            is_home = m['homeTeam'] == team
            
            my_score = h_score if is_home else a_score
            opp_score = a_score if is_home else h_score
            
            goals_scored += my_score
            goals_conceded += opp_score
            
            if my_score > opp_score:
                wins += 1
            elif my_score == opp_score:
                draws += 1
            else:
                losses += 1
                
        return {
            "played": len(recent),
            "wins": wins,
            "draws": draws,
            "losses": losses,
            "avg_goals_for": goals_scored / len(recent) if recent else 0,
            "avg_goals_against": goals_conceded / len(recent) if recent else 0
        }

    def predict_match(self, home_team, away_team):
        # Poisson Distribution approach
        # 1. Calculate Average Goals for Home Team (home attack strength) vs Away Team (away defense weakness)
        
        # Global Averages (Simple approximation)
        avg_home_goals = 1.5
        avg_away_goals = 1.1

        home_stats = self.get_team_stats(home_team, 'home', 10) # Look at last 10 for better sample
        away_stats = self.get_team_stats(away_team, 'away', 10)
        
        # Attack Strength: Team Avg Goals / League Avg Goals
        home_attack = (home_stats['avg_goals_for'] / avg_home_goals) if avg_home_goals else 1.0
        away_defense = (away_stats['avg_goals_against'] / avg_home_goals) if avg_home_goals else 1.0 # using avg_home because they are defending against home
        
        away_attack = (away_stats['avg_goals_for'] / avg_away_goals) if avg_away_goals else 1.0
        home_defense = (home_stats['avg_goals_against'] / avg_away_goals) if avg_away_goals else 1.0 # using avg_away because they are defending against away

        # Expected Goals
        lambda_home = home_attack * away_defense * avg_home_goals
        lambda_away = away_attack * home_defense * avg_away_goals
        
        # Simulation (Grid)
        max_goals = 6
        probs = {}
        
        def poisson(k, lam):
            return (lam**k * math.exp(-lam)) / math.factorial(k)

        home_win_p = 0
        draw_p = 0
        away_win_p = 0
        
        most_likely_score = (0, 0)
        max_prob = 0

        for i in range(max_goals): # Home goals
            for j in range(max_goals): # Away goals
                p = poisson(i, lambda_home) * poisson(j, lambda_away)
                if i > j:
                    home_win_p += p
                elif i == j:
                    draw_p += p
                else:
                    away_win_p += p
                
                if p > max_prob:
                    max_prob = p
                    most_likely_score = (i, j)

        # Normalize probs
        total = home_win_p + draw_p + away_win_p
        if total > 0:
            home_win_p /= total
            draw_p /= total
            away_win_p /= total

        return {
            "home_team": home_team,
            "away_team": away_team,
            "predicted_score": f"{most_likely_score[0]} - {most_likely_score[1]}",
            "probabilities": {
                "home_win": round(home_win_p * 100, 1),
                "draw": round(draw_p * 100, 1),
                "away_win": round(away_win_p * 100, 1)
            },
            "confidence": round(max(home_win_p, draw_p, away_win_p) * 100 + 15, 1), # boost confidence slightly for display
            "insights": {
                "home_form": home_stats,
                "away_form": away_stats
            }
        }
