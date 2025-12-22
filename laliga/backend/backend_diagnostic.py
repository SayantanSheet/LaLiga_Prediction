from predictor import PredictionEngine
import traceback

def run_diagnostic():
    try:
        print("Initializing PredictionEngine...")
        engine = PredictionEngine()
        teams = engine.get_teams()
        if not teams:
            print("No teams found!")
            return
            
        home = teams[0]
        away = teams[1] if len(teams) > 1 else teams[0]
        
        print(f"Testing prediction for {home} vs {away}...")
        result = engine.predict_match(home, away)
        print("SUCCESS! Result generated.")
        print(f"Home Win Prob: {result['probabilities']['home_win']}%")
        print(f"Home Form matches: {len(result['insights']['home_form']['match_history'])}")
    except Exception as e:
        print("FAILED! Traceback follows:")
        traceback.print_exc()

if __name__ == "__main__":
    run_diagnostic()
