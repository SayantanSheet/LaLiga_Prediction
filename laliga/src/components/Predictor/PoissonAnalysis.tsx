import { PoissonAnalysis as PoissonAnalysisType } from "@/api/client";
import { Home, Plane, Info, Target, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { GoalProbabilityChart } from "./GoalProbabilityChart";

interface PoissonAnalysisProps {
    analysis: PoissonAnalysisType;
}

export function PoissonAnalysis({ analysis }: PoissonAnalysisProps) {
    const { home_team_stats, away_team_stats, lambda_values, ai_insight } = analysis;

    const strengthColors = {
        Strong: "text-green-500 bg-green-500/10 border-green-500/20",
        Average: "text-amber-500 bg-amber-500/10 border-amber-500/20",
        Weak: "text-red-500 bg-red-500/10 border-red-500/20"
    };

    const renderTeamCard = (stats: any, type: 'Home' | 'Away') => {
        const isHome = type === 'Home';
        const Icon = isHome ? Home : Plane;

        return (
            <div className="flex flex-col gap-6 p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
                {/* Decorative Background Icon */}
                <Icon className="absolute -right-6 -bottom-6 w-32 h-32 text-muted/5 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity" />

                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "p-2.5 rounded-xl border",
                            isHome ? "text-primary bg-primary/10 border-primary/20" : "text-accent bg-accent/10 border-accent/20"
                        )}>
                            <Icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">{type} Performance</p>
                            <h4 className="text-xl font-bold text-foreground">{stats.team}</h4>
                        </div>
                    </div>
                    <span className={cn(
                        "text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full border",
                        strengthColors[stats.strength as keyof typeof strengthColors]
                    )}>
                        {stats.strength}
                    </span>
                </div>

                <div className="grid grid-cols-1 gap-5">
                    {/* Stat Items */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-semibold">
                                <span className="text-muted-foreground flex items-center gap-1.5 line-clamp-1">
                                    <Target className="w-3 h-3" /> Avg Goals Scored
                                </span>
                                <span className="text-foreground">{stats.avg_goals_scored.toFixed(2)}</span>
                            </div>
                            <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
                                <div
                                    className={cn("h-full rounded-full transition-all duration-1000", isHome ? "bg-primary" : "bg-accent")}
                                    style={{ width: `${Math.min((stats.avg_goals_scored / 3) * 100, 100)}%` }}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-semibold">
                                <span className="text-muted-foreground flex items-center gap-1.5 line-clamp-1">
                                    <Shield className="w-3 h-3" /> Avg Goals Conceded
                                </span>
                                <span className="text-foreground">{stats.avg_goals_conceded.toFixed(2)}</span>
                            </div>
                            <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-muted-foreground/40 rounded-full transition-all duration-1000"
                                    style={{ width: `${Math.min((stats.avg_goals_conceded / 3) * 100, 100)}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <div className="text-center">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Matches Played</p>
                            <p className="text-lg font-bold text-foreground">{stats.matches_played}</p>
                        </div>
                        <div className="h-8 w-px bg-border/50" />
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-primary uppercase tracking-tighter italic">Poisson λ</p>
                            <p className="text-2xl font-black text-primary tabular-nums">
                                {isHome ? lambda_values.lambda_home.toFixed(2) : lambda_values.lambda_away.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <section className="space-y-6 animate-slide-up" style={{ animationDelay: "300ms" }}>
            <div className="flex items-center gap-2 px-2">
                <div className="h-6 w-1 rounded-full bg-primary" />
                <h3 className="text-xl font-bold tracking-tight text-foreground">Home vs Away Performance Analysis</h3>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {renderTeamCard(home_team_stats, 'Home')}
                {renderTeamCard(away_team_stats, 'Away')}
            </div>

            {analysis.goal_probabilities && (
                <GoalProbabilityChart probabilities={analysis.goal_probabilities} />
            )}

            {ai_insight && (
                <div className="relative group">
                    <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-xl group-hover:bg-primary/10 transition-colors" />
                    <div className="relative p-5 rounded-2xl border border-primary/20 bg-primary/5 flex gap-4 items-start">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5">
                            <Info className="w-4 h-4" />
                        </div>
                        <div className="space-y-1">
                            <h5 className="text-xs font-bold text-primary uppercase tracking-wider">AI Poisson Insight</h5>
                            <p className="text-sm text-foreground/80 leading-relaxed italic">
                                "{ai_insight}"
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
