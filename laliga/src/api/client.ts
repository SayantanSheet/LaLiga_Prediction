
const API_BASE_URL = 'http://localhost:8000/api';

export interface PredictionResult {
    home_team: string;
    away_team: string;
    predicted_score: string;
    probabilities: {
        home_win: number;
        draw: number;
        away_win: number;
    };
    confidence: number;
    insights: {
        home_form: TeamStats;
        away_form: TeamStats;
    };
}

export interface TeamStats {
    played: number;
    wins: number;
    draws: number;
    losses: number;
    avg_goals_for: number;
    avg_goals_against: number;
}

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
    season?: string;
}

export const api = {
    getMatches: async (): Promise<Match[]> => {
        const response = await fetch(`${API_BASE_URL}/matches`);
        if (!response.ok) throw new Error('Failed to fetch matches');
        const data = await response.json();
        return data.matches;
    },

    getTeams: async (): Promise<string[]> => {
        const response = await fetch(`${API_BASE_URL}/teams`);
        if (!response.ok) throw new Error('Failed to fetch teams');
        const data = await response.json();
        return data.teams;
    },

    predictMatch: async (homeTeam: string, awayTeam: string): Promise<PredictionResult> => {
        const response = await fetch(`${API_BASE_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ home_team: homeTeam, away_team: awayTeam }),
        });
        if (!response.ok) throw new Error('Failed to get prediction');
        return response.json();
    },

    refreshData: async (): Promise<{ message: string }> => {
        const response = await fetch(`${API_BASE_URL}/refresh`, {
            method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to refresh data');
        return response.json();
    }
};
