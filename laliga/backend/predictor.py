import json
import os
import math
from datetime import datetime
from form_analyzer import RecentFormAnalyzer
from poisson_model import PoissonPerformanceModel

# Adjust path to match your project structure
# Assuming this file is in laliga/backend/predictor.py
# and data is in laliga/src/data
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_FILE = os.path.join(PROJECT_ROOT, 'src/data/matches-all-seasons.json')

class PredictionEngine:
    def __init__(self):
        self.matches = []
        if os.path.exists(DATA_FILE):
            self.load_data()
            self.analyzer = RecentFormAnalyzer(DATA_FILE)
            self.poisson_model = PoissonPerformanceModel(DATA_FILE)
        else:
            print(f"Error: Data file {DATA_FILE} not found. Prediction will be limited.")
            self.analyzer = None
            self.poisson_model = None

    def load_data(self):
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                self.matches = json.load(f)
        else:
            print(f"Warning: Data file not found at {DATA_FILE}")
            self.matches = []
        
        # Re-initialize analyzer if data is reloaded
        if hasattr(self, 'analyzer'):
            self.analyzer = RecentFormAnalyzer(DATA_FILE)
        
        if hasattr(self, 'poisson_model') and os.path.exists(DATA_FILE):
             self.poisson_model = PoissonPerformanceModel(DATA_FILE)

    def get_teams(self):
        teams = set()
        for m in self.matches:
            if m.get('homeTeam'): teams.add(m['homeTeam'])
            if m.get('awayTeam'): teams.add(m['awayTeam'])
        return sorted(list(teams))

    def get_team_stats(self, team, side=None, last_n=5):
        # Use the specialized RecentFormAnalyzer for consistent stats
        if self.analyzer:
            return self.analyzer.get_team_form(team, last_n)
        return {
            "wins": 0, "draws": 0, "losses": 0,
            "goals_scored": 0, "goals_conceded": 0,
            "match_history": [],
            "error": "Analyzer not initialized"
        }

    def predict_match(self, home_team, away_team):
        # Poisson Distribution approach
        # 1. Calculate Average Goals for Home Team (home attack strength) vs Away Team (away defense weakness)
        
        # Global Averages (Simple approximation)
        avg_home_goals = 1.5
        avg_away_goals = 1.1

        home_stats = self.get_team_stats(home_team, 'home', 10) # Look at last 10 for better sample
        away_stats = self.get_team_stats(away_team, 'away', 10)
        
        # Actually RecentFormAnalyzer returns total goals. Let's adjust calculation.
        n_home = len(home_stats.get('match_history', [])) or 1
        n_away = len(away_stats.get('match_history', [])) or 1

        # Attack Strength: Team Avg Goals / League Avg Goals
        # Use 1.0 (Average) if no games played or missing data
        home_attack = (home_stats['goals_scored'] / n_home / avg_home_goals) if avg_home_goals and home_stats.get('match_history') else 1.0
        away_defense = (away_stats['goals_conceded'] / n_away / avg_home_goals) if avg_home_goals and away_stats.get('match_history') else 1.0
        
        away_attack = (away_stats['goals_scored'] / n_away / avg_away_goals) if avg_away_goals and away_stats.get('match_history') else 1.0
        home_defense = (home_stats['goals_conceded'] / n_home / avg_away_goals) if avg_away_goals and home_stats.get('match_history') else 1.0

        # Expected Goals
        lambda_home = home_attack * away_defense * avg_home_goals
        lambda_away = away_attack * home_defense * avg_away_goals

        # Get fresh 5-game stats for UI display specifically
        home_form_ui = self.get_team_stats(home_team, last_n=5)
        away_form_ui = self.get_team_stats(away_team, last_n=5)
        
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

        # Calculate Over 1.5, Over 2.5, and BTTS probabilities
        over_1_5_p = 0
        over_2_5_p = 0
        btts_p = 0

        for i in range(max_goals): # Home goals
            for j in range(max_goals): # Away goals
                p = poisson(i, lambda_home) * poisson(j, lambda_away)
                total_goals = i + j
                if total_goals > 1.5:
                    over_1_5_p += p
                if total_goals > 2.5:
                    over_2_5_p += p
                if i >= 1 and j >= 1:
                    btts_p += p

        # Normalize probs
        total = home_win_p + draw_p + away_win_p
        if total > 0:
            home_win_p /= total
            draw_p /= total
            away_win_p /= total

        # Also normalize the goal probabilities relative to the same 6x6 grid total
        # though poisson sums to 1.0 eventually, 6x6 is a good approximation
        grid_total = sum(poisson(i, lambda_home) * poisson(j, lambda_away) 
                         for i in range(max_goals) for j in range(max_goals))
        
        if grid_total > 0:
            over_1_5_p /= grid_total
            over_2_5_p /= grid_total
            btts_p /= grid_total

        return {
            "home_team": home_team,
            "away_team": away_team,
            "predicted_score": f"{most_likely_score[0]} - {most_likely_score[1]}",
            "probabilities": {
                "home_win": round(home_win_p * 100, 1),
                "draw": round(draw_p * 100, 1),
                "away_win": round(away_win_p * 100, 1)
            },
            "goal_probabilities": {
                "over_1_5": round(over_1_5_p * 100, 1),
                "over_2_5": round(over_2_5_p * 100, 1),
                "btts": round(btts_p * 100, 1)
            },
            "confidence": round(max(home_win_p, draw_p, away_win_p) * 100 + 15, 1), # boost confidence slightly for display
            "insights": {
                "home_form": home_form_ui,
                "away_form": away_form_ui
            },
            "poisson_analysis": self._generate_poisson_analysis(home_team, away_team, over_1_5_p, over_2_5_p, btts_p)
        }

    def _generate_poisson_analysis(self, home_team, away_team, over_1_5_p, over_2_5_p, btts_p):
        if not self.poisson_model:
            return None
        
        stats = self.poisson_model.get_performance_stats(home_team, away_team)
        if "error" in stats:
            return None
            
        # Add strength labels
        def get_strength(avg_scored, avg_conceded):
            score = avg_scored - avg_conceded
            if score > 0.5: return "Strong"
            if score > -0.2: return "Average"
            return "Weak"
            
        stats['home_team_stats']['strength'] = get_strength(
            stats['home_team_stats']['avg_goals_scored'], 
            stats['home_team_stats']['avg_goals_conceded']
        )
        stats['away_team_stats']['strength'] = get_strength(
            stats['away_team_stats']['avg_goals_scored'], 
            stats['away_team_stats']['avg_goals_conceded']
        )

        # Add goal probabilities to the analysis object
        stats['goal_probabilities'] = {
            "over_1_5": round(over_1_5_p * 100, 1),
            "over_2_5": round(over_2_5_p * 100, 1),
            "btts": round(btts_p * 100, 1)
        }
        
        # Generate AI Insight
        h_lambda = stats['lambda_values']['lambda_home']
        a_lambda = stats['lambda_values']['lambda_away']
        
        insight = f"Based on Poisson analysis, {home_team} has an expected goal value of {h_lambda:.2f} at home, "
        insight += f"while {away_team} is expected to score {a_lambda:.2f} as the visitor. "
        
        if h_lambda > a_lambda + 0.5:
            insight += f"The home advantage significantly boosts {home_team}'s scoring potential."
        elif a_lambda > h_lambda + 0.5:
            insight += f"Despite being away, {away_team}'s offensive efficiency makes them a major threat."
        else:
            insight += "Both teams show comparable performance metrics in these conditions, suggesting a high-stakes encounter."
            
        stats['ai_insight'] = insight
        return stats
