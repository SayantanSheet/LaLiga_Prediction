import os
import json
import time
import random
from bs4 import BeautifulSoup

# Dependencies
try:
    import cloudscraper
    HAS_CLOUDSCRAPER = True
except ImportError:
    HAS_CLOUDSCRAPER = False
    print("cloudscraper not installed. Will rely on local HTML files if scraping fails.")

try:
    import requests
except ImportError:
    print("requests not installed. Please install it.")
    exit(1)

# Constants
BASE_URL_TEMPLATE = "https://fbref.com/en/comps/12/{season}/schedule/{season}-La-Liga-Scores-and-Fixtures"
# Adjust paths relative to script execution or fixed project path
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HTML_DIR = os.path.join(PROJECT_ROOT, 'src/data/html')
OUTPUT_JSON_FILE = os.path.join(PROJECT_ROOT, 'src/data/matches-all-seasons.json')
START_YEAR = 2014
END_YEAR = 2024

def seed_random(seed_str):
    h = 0
    for char in seed_str:
        h = (31 * h + ord(char)) & 0xFFFFFFFF
    state = h
    def rng():
        nonlocal state
        state = (1664525 * state + 1013904223) & 0xFFFFFFFF
        return state / 4294967296.0
    return rng

def parse_html_content(content, season_str):
    soup = BeautifulSoup(content, 'html.parser')
    # Remove comments just in case
    text = str(soup).replace('<!--', '').replace('-->', '')
    soup = BeautifulSoup(text, 'html.parser')
    
    table = soup.find('table', id=lambda x: x and 'sched' in x)
    if not table:
        return []

    rows = table.find('tbody').find_all('tr')
    matches = []
    match_count = 0
    
    for row in rows:
        if 'thead' in row.get('class', []):
            continue
            
        date_cell = row.find('td', {'data-stat': 'date'})
        home_team_cell = row.find('td', {'data-stat': 'home_team'})
        away_team_cell = row.find('td', {'data-stat': 'away_team'})
        score_cell = row.find('td', {'data-stat': 'score'})
        time_cell = row.find('td', {'data-stat': 'start_time'})
        venue_cell = row.find('td', {'data-stat': 'venue'})
        gameweek_header = row.find('th', {'data-stat': 'gameweek'})
        
        if not date_cell or not home_team_cell or not away_team_cell:
            continue
            
        date = date_cell.get_text(strip=True)
        home_team = home_team_cell.get_text(strip=True)
        away_team = away_team_cell.get_text(strip=True)
        
        # Skip empty rows
        if not date or not home_team or not away_team:
            continue

        match_time = time_cell.get_text(strip=True).replace(' ', '') if time_cell else "21:00"
        match_time = match_time[:5] if len(match_time) >= 5 else "21:00"
        
        venue = venue_cell.get_text(strip=True) if venue_cell else "Generic Stadium"
        matchday_str = gameweek_header.get_text(strip=True) if gameweek_header else "0"
        matchday = int(matchday_str) if matchday_str.isdigit() else 0
        
        score_text = score_cell.get_text(strip=True) if score_cell else ""
        
        home_score = 0
        away_score = 0
        has_score = False
        
        if score_text and (u'–' in score_text or '-' in score_text):
            parts = score_text.replace(u'–', '-').split('-')
            if len(parts) == 2:
                try:
                    home_score = int(parts[0])
                    away_score = int(parts[1])
                    has_score = True
                except ValueError:
                    pass
        
        match_id = f"{season_str}-{match_count + 1}"
        rng = seed_random(match_id + home_team + away_team)
        
        # Pseudo-probs
        if has_score:
            if home_score > away_score:
                home_win_prob = 40 + int(rng() * 40)
                draw_prob = 10 + int(rng() * 20)
                away_win_prob = 100 - home_win_prob - draw_prob
            elif away_score > home_score:
                away_win_prob = 40 + int(rng() * 40)
                draw_prob = 10 + int(rng() * 20)
                home_win_prob = 100 - away_win_prob - draw_prob
            else:
                draw_prob = 35 + int(rng() * 30)
                home_win_prob = int((100 - draw_prob) / 2)
                away_win_prob = home_win_prob
        else:
            home_win_prob = 33 + int(rng() * 20)
            draw_prob = 20 + int(rng() * 10)
            away_win_prob = 100 - home_win_prob - draw_prob

        confidence = 50 + int(rng() * 40)

        matches.append({
            "id": match_id,
            "homeTeam": home_team,
            "awayTeam": away_team,
            "homeScore": home_score,
            "awayScore": away_score,
            "homeWinProb": home_win_prob,
            "drawProb": draw_prob,
            "awayWinProb": away_win_prob,
            "confidence": confidence,
            "date": date,
            "time": match_time,
            "stadium": venue,
            "matchday": matchday,
            "season": season_str
        })
        match_count += 1
        
    return matches

def fetch_season(year_start):
    year_end = year_start + 1
    season_str = f"{year_start}-{year_end}"
    
    # 1. Try local file first
    local_path = os.path.join(HTML_DIR, f"{season_str}.html")
    if os.path.exists(local_path):
        print(f"Reading local file for {season_str}...")
        with open(local_path, 'r', encoding='utf-8') as f:
            return parse_html_content(f.read(), season_str)

    # 2. Try scraping
    url = BASE_URL_TEMPLATE.format(season=season_str)
    print(f"Fetching {url}...")
    
    try:
        content = ""
        if HAS_CLOUDSCRAPER:
            scraper = cloudscraper.create_scraper()
            resp = scraper.get(url)
            if resp.status_code == 200:
                content = resp.text
            else:
                print(f"Failed to fetch {season_str} (Status {resp.status_code}).")
        else:
            print("Skipping download (cloudscraper missing).")
            
        if content:
            matches = parse_html_content(content, season_str)
            if matches:
                 # Save HTML for future
                 os.makedirs(HTML_DIR, exist_ok=True)
                 with open(local_path, 'w', encoding='utf-8') as f:
                     f.write(content)
                 return matches
            else:
                print(f"No match table found in fetched content for {season_str}.")
    except Exception as e:
        print(f"Error fetching {season_str}: {e}")

    print(f"Could not load data for {season_str}. Please manually save the page to laliga/src/data/html/{season_str}.html")
    return []

def main():
    print(f"Starting data collection {START_YEAR} to {END_YEAR}...")
    all_matches = []
    
    for year in range(START_YEAR, END_YEAR + 1):
        matches = fetch_season(year)
        all_matches.extend(matches)
        print(f"Got {len(matches)} matches for {year}-{year+1}")
        # Be nice if scraping
        if not os.path.exists(os.path.join(HTML_DIR, f"{year}-{year+1}.html")):
            time.sleep(3)

    print(f"Saving {len(all_matches)} total matches to {OUTPUT_JSON_FILE}...")
    try:
        os.makedirs(os.path.dirname(OUTPUT_JSON_FILE), exist_ok=True)
        with open(OUTPUT_JSON_FILE, 'w', encoding='utf-8') as f:
            json.dump(all_matches, f, indent=2)
    except Exception as e:
        print(f"Error saving JSON: {e}")

if __name__ == "__main__":
    main()
