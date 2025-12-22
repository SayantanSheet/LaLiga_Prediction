from form_analyzer import RecentFormAnalyzer
import os
import json

def verify_analyzer():
    # Adjust path to your data file
    data_path = 'c:/Users/Sayantan/Downloads/laliga-predictor-pro-main/laliga/src/data/raw_data.csv'
    
    if not os.path.exists(data_path):
        print(f"Error: Data file not found at {data_path}")
        return

    print("--- Initializing RecentFormAnalyzer ---")
    analyzer = RecentFormAnalyzer(data_path)
    
    # Test for a known team
    test_team = 'Real Madrid'
    print(f"\n--- Analyzing Form for: {test_team} ---")
    
    form_results = analyzer.get_team_form(test_team)
    
    print(json.dumps(form_results, indent=4))
    
    # Simple validation checks
    if "error" not in form_results:
        print("\nVerification successful!")
        print(f"Stats: W:{form_results['wins']} D:{form_results['draws']} L:{form_results['losses']}")
        print(f"Goals: For {form_results['goals_scored']} / Against {form_results['goals_conceded']}")
    else:
        print(f"Verification failed: {form_results['error']}")

if __name__ == "__main__":
    verify_analyzer()
