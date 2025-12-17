export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  homeWinProb: number;
  drawProb: number;
  awayWinProb: number;
  confidence: number;
  date: string;
  time: string;
  stadium: string;
  matchday: number;
}

export const mockMatches: Match[] = [
  {
    id: "1",
    homeTeam: "Real Madrid",
    awayTeam: "Barcelona",
    homeScore: 2,
    awayScore: 1,
    homeWinProb: 45,
    drawProb: 28,
    awayWinProb: 27,
    confidence: 72,
    date: "2024-03-23",
    time: "21:00",
    stadium: "Santiago Bernabéu",
    matchday: 29,
  },
  {
    id: "2",
    homeTeam: "Atlético Madrid",
    awayTeam: "Sevilla",
    homeScore: 1,
    awayScore: 0,
    homeWinProb: 52,
    drawProb: 26,
    awayWinProb: 22,
    confidence: 68,
    date: "2024-03-24",
    time: "18:30",
    stadium: "Metropolitano",
    matchday: 29,
  },
  {
    id: "3",
    homeTeam: "Valencia",
    awayTeam: "Real Sociedad",
    homeScore: 2,
    awayScore: 2,
    homeWinProb: 35,
    drawProb: 33,
    awayWinProb: 32,
    confidence: 58,
    date: "2024-03-24",
    time: "16:15",
    stadium: "Mestalla",
    matchday: 29,
  },
  {
    id: "4",
    homeTeam: "Athletic Bilbao",
    awayTeam: "Villarreal",
    homeScore: 3,
    awayScore: 1,
    homeWinProb: 48,
    drawProb: 27,
    awayWinProb: 25,
    confidence: 65,
    date: "2024-03-25",
    time: "21:00",
    stadium: "San Mamés",
    matchday: 29,
  },
  {
    id: "5",
    homeTeam: "Betis",
    awayTeam: "Girona",
    homeScore: 1,
    awayScore: 2,
    homeWinProb: 38,
    drawProb: 30,
    awayWinProb: 32,
    confidence: 61,
    date: "2024-03-25",
    time: "18:30",
    stadium: "Benito Villamarín",
    matchday: 29,
  },
];

export const laLigaTeams = [
  "Real Madrid",
  "Barcelona",
  "Atlético Madrid",
  "Athletic Bilbao",
  "Girona",
  "Real Sociedad",
  "Real Betis",
  "Villarreal",
  "Valencia",
  "Sevilla",
  "Getafe",
  "Osasuna",
  "Alavés",
  "Celta Vigo",
  "Mallorca",
  "Rayo Vallecano",
  "Las Palmas",
  "Granada",
  "Almería",
  "Cádiz",
];

export const teamLogos: Record<string, string> = {
  "Real Madrid": "⚪",
  "Barcelona": "🔵",
  "Atlético Madrid": "🔴",
  "Sevilla": "⚪",
  "Valencia": "🦇",
  "Real Sociedad": "🔵",
  "Athletic Bilbao": "🦁",
  "Villarreal": "🟡",
  "Real Betis": "💚",
  "Girona": "🔴",
  "Getafe": "🔵",
  "Osasuna": "🔴",
  "Alavés": "🔵",
  "Celta Vigo": "🔵",
  "Mallorca": "🔴",
  "Rayo Vallecano": "⚡",
  "Las Palmas": "🟡",
  "Granada": "🔴",
  "Almería": "🔴",
  "Cádiz": "🟡",
};
