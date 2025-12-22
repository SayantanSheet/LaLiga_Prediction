import { TeamStats } from "@/api/client";
import { teamLogos } from "@/data/matches";
import { cn } from "@/lib/utils";
import { Info, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface RecentFormProps {
    homeTeam: string;
    awayTeam: string;
    homeStats: TeamStats;
    awayStats: TeamStats;
}

export function RecentForm({ homeTeam, awayTeam, homeStats, awayStats }: RecentFormProps) {

    // Calculate Form Rating
    const getFormRating = (stats: TeamStats) => {
        const points = (stats.wins * 3) + (stats.draws * 1);
        const maxPoints = stats.played * 3;
        const ratio = points / maxPoints;

        if (ratio >= 0.8) return { label: "Excellent", color: "bg-green-500", text: "text-green-500" };
        if (ratio >= 0.5) return { label: "Good", color: "bg-blue-500", text: "text-blue-500" };
        if (ratio >= 0.3) return { label: "Average", color: "bg-yellow-500", text: "text-yellow-500" };
        return { label: "Poor", color: "bg-red-500", text: "text-red-500" };
    };

    const homeRating = getFormRating(homeStats);
    const awayRating = getFormRating(awayStats);

    // Calculate Form Strength for Comparison Bar
    const hPoints = (homeStats.wins * 3) + homeStats.draws;
    const aPoints = (awayStats.wins * 3) + awayStats.draws;
    const totalPoints = hPoints + aPoints || 1; // prevent div by zero
    const hStrength = (hPoints / totalPoints) * 100;

    const outcomeColors = {
        Win: "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]",
        Draw: "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]",
        Loss: "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"
    };

    return (
        <div className="space-y-8 py-6">
            <div className="text-center">
                <h3 className="text-2xl font-display font-bold uppercase tracking-tight">
                    Recent Form <span className="text-primary">Analysis</span>
                </h3>
                <p className="text-sm text-muted-foreground mt-1">Performance in the last 5 matches</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Team Cards */}
                {[
                    { name: homeTeam, stats: homeStats, rating: homeRating, side: "Home" },
                    { name: awayTeam, stats: awayStats, rating: awayRating, side: "Away" }
                ].map((team, idx) => (
                    <div key={idx} className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
                        <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-5 group-hover:scale-110 transition-transform duration-500`}>
                            {teamLogos[team.name] || "⚽"}
                        </div>

                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="text-4xl">{teamLogos[team.name] || "⚽"}</div>
                                <div>
                                    <h4 className="font-bold text-xl leading-tight">{team.name}</h4>
                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">{team.side}</span>
                                </div>
                            </div>
                            <div className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border", team.rating.color.replace('bg-', 'border-'), team.rating.text)}>
                                {team.rating.label} Form
                            </div>
                        </div>

                        {/* Result Indicators */}
                        <div className="flex gap-2 mb-8">
                            {team.stats.match_history.map((m, i) => (
                                <div
                                    key={i}
                                    title={`${m.outcome} vs ${m.opponent} (${m.score})`}
                                    className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm transition-transform hover:-translate-y-1 cursor-help", outcomeColors[m.outcome])}
                                >
                                    {m.outcome[0]}
                                </div>
                            ))}
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="bg-background/40 p-3 rounded-xl border border-border/30">
                                <div className="text-2xl font-display font-bold">{team.stats.wins}-{team.stats.draws}-{team.stats.losses}</div>
                                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">W - D - L</div>
                            </div>
                            <div className="bg-background/40 p-3 rounded-xl border border-border/30">
                                <div className="text-2xl font-display font-bold text-primary">{team.stats.goals_scored}:{team.stats.goals_conceded}</div>
                                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Goals Score/Conc</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Comparison Bar */}
            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-end mb-3">
                    <div className="text-left">
                        <span className="text-xs font-bold text-[hsl(var(--team-home))] uppercase tracking-widest">{homeTeam}</span>
                        <div className="text-2xl font-display font-bold leading-none">{hPoints} pts</div>
                    </div>
                    <div className="text-center pb-1">
                        <span className="text-xs font-black text-muted-foreground uppercase tracking-wider bg-muted px-3 py-1 rounded-full">Form Momentum</span>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-bold text-[hsl(var(--team-away))] uppercase tracking-widest">{awayTeam}</span>
                        <div className="text-2xl font-display font-bold leading-none">{aPoints} pts</div>
                    </div>
                </div>

                <div className="relative h-4 w-full bg-muted rounded-full overflow-hidden flex shadow-inner">
                    <div
                        style={{ width: `${hStrength}%` }}
                        className="h-full bg-[hsl(var(--team-home))] transition-all duration-1000 ease-out relative"
                    >
                        <div className="absolute inset-0 bg-white/10 animate-pulse-slow" />
                    </div>
                    <div
                        style={{ width: `${100 - hStrength}%` }}
                        className="h-full bg-[hsl(var(--team-away))] transition-all duration-1000 ease-out relative"
                    >
                        <div className="absolute inset-0 bg-white/10 animate-pulse-slow" />
                    </div>
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-background/50 -ml-px z-10" />
                </div>

                <p className="text-center text-xs text-muted-foreground mt-4 font-medium italic">
                    Points accumulated in the last 5 matches comparison
                </p>
            </div>

            {/* AI Insight */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex gap-4 items-start">
                <div className="mt-1 bg-primary/20 p-2 rounded-lg">
                    <Info className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-1">
                    <h5 className="font-bold text-sm text-primary uppercase tracking-wider">Predictor Insight</h5>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                        {hPoints > aPoints
                            ? `Recent form significantly favors ${homeTeam}. Their momentum is likely to counteract seasonal averages, putting them in a strong position for a result.`
                            : aPoints > hPoints
                                ? `${awayTeam} is currently in a superior run of form. Our Poisson model has been adjusted to account for their higher efficiency in recent weeks.`
                                : `Both teams share identical momentum in their recent games. This match is likely to be decided by tactical discipline and home-ground advantage rather than psychological momentum.`}
                        {" "}Matches with high form disparity often lead to "upsets" against long-term statistics.
                    </p>
                </div>
            </div>
        </div>
    );
}
