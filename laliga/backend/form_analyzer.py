import pandas as pd
import json
import os

class RecentFormAnalyzer:
    """
    Analyzes the recent form of a team based on historical match data.
    Suitable for integration into a Poisson Distribution based prediction model.
    """
    def __init__(self, data_source):
        """
        Initialize with a path to a CSV or JSON file.
        """
        self.df = self._load_data(data_source)
        self._preprocess_data()

    def _load_data(self, source):
        if source.endswith('.csv'):
            return pd.read_csv(source)
        elif source.endswith('.json'):
            with open(source, 'r', encoding='utf-8') as f:
                data = json.load(f)
            # Normalize JSON keys to match expected CSV-style column names if necessary
            # For this project, we assume standard column names as requested.
            return pd.DataFrame(data)
        else:
            raise ValueError("Unsupported data format. Please provide .csv or .json")

    def _preprocess_data(self):
        # Standardize score columns if they use different names in JSON vs CSV
        # User requested: HomeGoals, AwayGoals
        name_map = {
            'FTHG': 'HomeGoals',
            'FTAG': 'AwayGoals',
            'homeScore': 'HomeGoals',
            'awayScore': 'AwayGoals',
            'homeTeam': 'HomeTeam',
            'awayTeam': 'AwayTeam',
            'date': 'Date'
        }
        self.df.rename(columns=name_map, inplace=True)

        # Convert Date to datetime for chronological sorting
        if 'Date' in self.df.columns:
            self.df['Date'] = pd.to_datetime(self.df['Date'], dayfirst=True, errors='coerce')
        
        # Clean team names (handle newlines and extra spaces found in JSON)
        for col in ['HomeTeam', 'AwayTeam']:
            if col in self.df.columns:
                self.df[col] = self.df[col].astype(str).str.replace(r'\s+', ' ', regex=True).str.strip()

    def get_team_form(self, team_name, last_n=5):
        """
        Filters the last N matches for a team and calculates form statistics.
        Returns a dictionary with result counts and goal totals.
        """
        # Clean input name just in case
        team_name = ' '.join(str(team_name).split())

        # Filter matches where the team played (either Home or Away)
        team_matches = self.df[(self.df['HomeTeam'] == team_name) | (self.df['AwayTeam'] == team_name)].copy()
        
        if team_matches.empty:
            # Return a valid structure with zeros instead of an error to prevent pipeline crashes
            return {
                "team": team_name,
                "period": "No data",
                "wins": 0, "draws": 0, "losses": 0,
                "goals_scored": 0, "goals_conceded": 0,
                "match_history": [],
                "error": "No matches found"
            }

        # Sort by date descending and take last N
        last_matches = team_matches.sort_values(by='Date', ascending=False).head(last_n)

        results = {
            "team": team_name,
            "period": f"Last {len(last_matches)} matches",
            "wins": 0,
            "draws": 0,
            "losses": 0,
            "goals_scored": 0,
            "goals_conceded": 0,
            "match_history": []
        }

        for _, match in last_matches.iterrows():
            is_home = match['HomeTeam'] == team_name
            h_goals = int(match['HomeGoals'])
            a_goals = int(match['AwayGoals'])
            
            # Determine goals for/against
            goals_for = h_goals if is_home else a_goals
            goals_against = a_goals if is_home else h_goals
            
            results["goals_scored"] += goals_for
            results["goals_conceded"] += goals_against
            
            # Determine outcome
            outcome = ""
            if h_goals == a_goals:
                results["draws"] += 1
                outcome = "Draw"
            elif (is_home and h_goals > a_goals) or (not is_home and a_goals > h_goals):
                results["wins"] += 1
                outcome = "Win"
            else:
                results["losses"] += 1
                outcome = "Loss"
            
            # Track history for Viva explanation
            match_date = match['Date']
            if hasattr(match_date, 'date'):
                date_str = str(match_date.date())
            elif isinstance(match_date, str):
                date_str = match_date.split('T')[0] # handle potential ISO strings
            else:
                date_str = "Unknown"

            results["match_history"].append({
                "date": date_str,
                "opponent": match['AwayTeam'] if is_home else match['HomeTeam'],
                "venue": "Home" if is_home else "Away",
                "score": f"{h_goals}-{a_goals}",
                "outcome": outcome
            })

        return results

# Example Usage (Commented out for module import)
if __name__ == "__main__":
    # Assuming the data exists in the project path
    analyzer = RecentFormAnalyzer('laliga/src/data/raw_data.csv')
    form = analyzer.get_team_form('Real Madrid')
    print(json.dumps(form, indent=4))
