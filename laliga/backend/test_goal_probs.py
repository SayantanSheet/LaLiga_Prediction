from predictor import PredictionEngine
import json

def test_predictions():
    engine = PredictionEngine()
    teams = engine.get_teams()
    
    if len(teams) < 2:
        print("Not enough teams to test.")
        return

    home_team = teams[0]
    away_team = teams[1]
    
    print(f"Testing prediction for: {home_team} vs {away_team}")
    result = engine.predict_match(home_team, away_team)
    
    print("\nResult Probabilities:")
    print(json.dumps(result['probabilities'], indent=2))
    
    print("\nGoal Probabilities:")
    print(json.dumps(result['goal_probabilities'], indent=2))
    
    if 'poisson_analysis' in result and result['poisson_analysis']:
        print("\nPoisson Analysis Goal Probabilities:")
        print(json.dumps(result['poisson_analysis']['goal_probabilities'], indent=2))

if __name__ == "__main__":
    test_predictions()
