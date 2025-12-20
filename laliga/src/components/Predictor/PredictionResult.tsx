import { PredictionResult } from "@/api/client";
import { teamLogos } from "@/data/matches";
import { cn } from "@/lib/utils";
import { Trophy, TrendingUp, AlertCircle, BarChart3, Activity } from "lucide-react";

interface PredictionResultCardProps {
    result: PredictionResult;
}

export function PredictionResultCard({ result }: PredictionResultCardProps) {
    const { home_team, away_team, predicted_score, probabilities, confidence, insights } = result;

    const [homeScore, awayScore] = predicted_score.split("-").map(s => parseInt(s.trim()));
    const total = probabilities.home_win + probabilities.draw + probabilities.away_win; // Should be ~100 but normalize for bar width

    // Determine winner for styling
    const homeWinner = homeScore > awayScore;
    const awayWinner = awayScore > homeScore;
    const isDraw = homeScore === awayScore;

    return (
        <div className="space-y-8 animate-slide-up">
            {/* Score Board */}
            <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-muted/40" />

                {/* League Header */}
                <div className="relative text-center py-4 border-b border-border/50 bg-muted/30">
                    <span className="text-sm font-bold tracking-widest text-primary uppercase">LaLiga Match Prediction</span>
                </div>

                <div className="relative p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">

                    {/* Home Team */}
                    <div className="flex flex-col items-center gap-4 flex-1 animate-slide-up" style={{ animationDelay: "100ms" }}>
                        <div className="text-6xl md:text-7xl filter drop-shadow-lg transition-transform hover:scale-110 duration-300">
                            {teamLogos[home_team] || "⚽"}
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-center text-foreground">{home_team}</h3>
                        {homeWinner && <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full animate-bounce">PREDICTED WINNER</span>}
                    </div>

                    {/* Score Display */}
                    <div className="flex flex-col items-center gap-2 z-10 animate-score-reveal">
                        <div className="flex items-center gap-4">
                            <span className={cn("text-6xl md:text-8xl font-display font-bold tabular-nums", homeWinner ? "text-primary" : "text-foreground")}>
                                {homeScore}
                            </span>
                            <span className="text-4xl text-muted-foreground/40 font-light">-</span>
                            <span className={cn("text-6xl md:text-8xl font-display font-bold tabular-nums", awayWinner ? "text-primary" : "text-foreground")}>
                                {awayScore}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2 bg-background/80 backdrop-blur-sm px-4 py-1.5 rounded-full border border-border/50 shadow-sm">
                            <Activity className="w-4 h-4 text-accent" />
                            <span className="text-sm font-medium text-muted-foreground">Confidence: <span className="text-foreground font-bold">{confidence}%</span></span>
                        </div>
                    </div>

                    {/* Away Team */}
                    <div className="flex flex-col items-center gap-4 flex-1 animate-slide-up" style={{ animationDelay: "200ms" }}>
                        <div className="text-6xl md:text-7xl filter drop-shadow-lg transition-transform hover:scale-110 duration-300">
                            {teamLogos[away_team] || "⚽"}
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-center text-foreground">{away_team}</h3>
                        {awayWinner && <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full animate-bounce">PREDICTED WINNER</span>}
                    </div>
                </div>
            </div>

            {/* Probability Bars */}
            <div className="relative px-6 pb-8 md:px-12">
                <div className="flex justify-between text-xs font-medium text-muted-foreground mb-2">
                    <span>Home Win {probabilities.home_win}%</span>
                    <span>Draw {probabilities.draw}%</span>
                    <span>Away Win {probabilities.away_win}%</span>
                </div>
                <div className="flex h-3 rounded-full overflow-hidden bg-muted/50 w-full">
                    <div style={{ width: `${probabilities.home_win}%` }} className="bg-[hsl(var(--team-home))] transition-all duration-1000" />
                    <div style={{ width: `${probabilities.draw}%` }} className="bg-[hsl(var(--draw))] transition-all duration-1000" />
                    <div style={{ width: `${probabilities.away_win}%` }} className="bg-[hsl(var(--team-away))] transition-all duration-1000" />
                </div>
            </div>


            {/* Analysis Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Recent Form Comparison */}
                <div className="bg-card border border-border/50 rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <h4 className="font-bold text-lg">Statistical Analysis</h4>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Avg Goals Scored</span>
                            <div className="flex gap-4 font-medium">
                                <span className="text-[hsl(var(--team-home))]">{insights.home_form.avg_goals_for.toFixed(2)}</span>
                                <span className="text-muted-foreground">vs</span>
                                <span className="text-[hsl(var(--team-away))]">{insights.away_form.avg_goals_for.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="h-px bg-border/50" />
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Avg Goals Conceded</span>
                            <div className="flex gap-4 font-medium">
                                <span className="text-[hsl(var(--team-home))]">{insights.home_form.avg_goals_against.toFixed(2)}</span>
                                <span className="text-muted-foreground">vs</span>
                                <span className="text-[hsl(var(--team-away))]">{insights.away_form.avg_goals_against.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="h-px bg-border/50" />
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Sample Size</span>
                            <div className="flex gap-4 font-medium">
                                <span>{insights.home_form.played} Games</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Match Insights */}
                <div className="bg-card border border-border/50 rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
                    <div className="flex items-center gap-2 mb-4">
                        <BarChart3 className="w-5 h-5 text-accent" />
                        <h4 className="font-bold text-lg">Match Insights</h4>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                            <Trophy className="w-4 h-4 text-primary mt-1" />
                            <p className="text-sm text-foreground/90">
                                {homeWinner ? `${home_team} is favored to win` : awayWinner ? `${away_team} is favored to win` : "A tight draw is expected"} based on specific home/away performance metrics.
                            </p>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                            <AlertCircle className="w-4 h-4 text-accent mt-1" />
                            <p className="text-sm text-foreground/90">
                                Both teams average {(insights.home_form.avg_goals_for + insights.away_form.avg_goals_for).toFixed(1)} combined goals per game, suggesting a {(insights.home_form.avg_goals_for + insights.away_form.avg_goals_for) > 2.5 ? "High Scoring" : "Low Scoring"} affair.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
