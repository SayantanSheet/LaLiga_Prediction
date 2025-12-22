import pandas as pd
import json
import os

class PoissonPerformanceModel:
    def __init__(self, data_path):
        """
        Initialize the model with match data.
        
        Args:
            data_path (str): Absolute path to the matches JSON file.
        """
        self.data_path = data_path
        self.df = self._load_and_clean_data()

    def _load_and_clean_data(self):
        """
        Loads the JSON data into a pandas DataFrame and cleans team names.
        """
        if not os.path.exists(self.data_path):
            raise FileNotFoundError(f"Data file not found at {self.data_path}")
            
        with open(self.data_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        df = pd.DataFrame(data)
        
        # Clean team names (remove newlines and extra whitespace)
        df['homeTeam'] = df['homeTeam'].str.replace(r'\n', ' ', regex=True).str.strip()
        df['awayTeam'] = df['awayTeam'].str.replace(r'\n', ' ', regex=True).str.strip()
        
        return df

    def get_performance_stats(self, home_team, away_team):
        """
        Calculates home stats for the home team and away stats for the away team,
        then computes Poisson lambda values.
        
        Args:
            home_team (str): Name of the home team.
            away_team (str): Name of the away team.
            
        Returns:
            dict: Structured data containing team stats and calculated lambdas.
        """
        # Normalize inputs
        home_team = home_team.strip()
        away_team = away_team.strip()

        # 1. Home team performance only in home matches
        home_matches = self.df[self.df['homeTeam'] == home_team]
        home_played = len(home_matches)
        
        if home_played == 0:
            return {"error": f"No home match data found for team: {home_team}"}
            
        home_avg_scored = home_matches['homeScore'].mean()
        home_avg_conceded = home_matches['awayScore'].mean()

        # 2. Away team performance only in away matches
        away_matches = self.df[self.df['awayTeam'] == away_team]
        away_played = len(away_matches)
        
        if away_played == 0:
            return {"error": f"No away match data found for team: {away_team}"}
            
        away_avg_scored = away_matches['awayScore'].mean()
        away_avg_conceded = away_matches['homeScore'].mean()

        # 3. Calculate Poisson λ (expected goals)
        # λ_home = (Home team home goals scored avg) × (Away team away goals conceded avg)
        lambda_home = home_avg_scored * away_avg_conceded
        
        # λ_away = (Away team away goals scored avg) × (Home team home goals conceded avg)
        lambda_away = away_avg_scored * home_avg_conceded

        return {
            "home_team_stats": {
                "team": home_team,
                "matches_played": home_played,
                "avg_goals_scored": round(float(home_avg_scored), 3),
                "avg_goals_conceded": round(float(home_avg_conceded), 3)
            },
            "away_team_stats": {
                "team": away_team,
                "matches_played": away_played,
                "avg_goals_scored": round(float(away_avg_scored), 3),
                "avg_goals_conceded": round(float(away_avg_conceded), 3)
            },
            "lambda_values": {
                "lambda_home": round(float(lambda_home), 3),
                "lambda_away": round(float(lambda_away), 3)
            }
        }

if __name__ == "__main__":
    # Example usage for testing
    import os
    
    # Path setup
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(os.path.dirname(current_dir))
    data_file = os.path.join(project_root, 'laliga', 'src', 'data', 'matches-all-seasons.json')
    
    try:
        model = PoissonPerformanceModel(data_file)
        # Test with a classic matchup: Barcelona vs Real Madrid
        result = model.get_performance_stats("Barcelona", "Real Madrid")
        print(json.dumps(result, indent=4))
    except Exception as e:
        print(f"Error: {e}")
