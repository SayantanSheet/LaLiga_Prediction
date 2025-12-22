
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
    goal_probabilities: {
        over_1_5: number;
        over_2_5: number;
        btts: number;
    };
    confidence: number;
    insights: {
        home_form: TeamStats;
        away_form: TeamStats;
    };
    poisson_analysis?: PoissonAnalysis;
}

export interface PoissonAnalysis {
    home_team_stats: PoissonTeamStats;
    away_team_stats: PoissonTeamStats;
    lambda_values: {
        lambda_home: number;
        lambda_away: number;
    };
    goal_probabilities?: {
        over_1_5: number;
        over_2_5: number;
        btts: number;
    };
    ai_insight?: string;
}

export interface PoissonTeamStats {
    team: string;
    matches_played: number;
    avg_goals_scored: number;
    avg_goals_conceded: number;
    strength: 'Strong' | 'Average' | 'Weak';
}

export interface TeamStats {
    played: number;
    wins: number;
    draws: number;
    losses: number;
    goals_scored: number;
    goals_conceded: number;
    match_history: MatchHistoryItem[];
}

export interface MatchHistoryItem {
    date: string;
    opponent: string;
    venue: 'Home' | 'Away';
    score: string;
    outcome: 'Win' | 'Draw' | 'Loss';
}

export const api = {
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
