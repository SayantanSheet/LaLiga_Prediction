import { Match, teamLogos } from "@/data/matches";
import { Trophy, Calendar, MapPin } from "lucide-react";

interface MatchCardProps {
  match: Match;
  index: number;
}

export const MatchCard = ({ match, index }: MatchCardProps) => {
  const getResultColor = (homeScore: number, awayScore: number, isHome: boolean) => {
    if (homeScore === awayScore) return "text-result-draw";
    if (isHome) return homeScore > awayScore ? "text-result-win" : "text-result-lose";
    return awayScore > homeScore ? "text-result-win" : "text-result-lose";
  };

  return (
    <div 
      className="match-card group"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Matchday Badge */}
      <div className="absolute top-4 right-4">
        <span className="stat-badge bg-primary/10 text-primary">
          <Trophy className="w-3.5 h-3.5" />
          Matchday {match.matchday}
        </span>
      </div>

      {/* Match Info */}
      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-6">
        <Calendar className="w-4 h-4" />
        <span>{new Date(match.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
        <span className="text-muted-foreground/50">•</span>
        <span>{match.time}</span>
      </div>

      {/* Teams and Score */}
      <div className="flex items-center justify-between gap-4">
        {/* Home Team */}
        <div className="flex-1 text-center">
          <div className="text-4xl mb-2">{teamLogos[match.homeTeam]}</div>
          <h3 className="font-display text-lg font-semibold text-foreground truncate">
            {match.homeTeam}
          </h3>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Home</span>
        </div>

        {/* Score Display */}
        <div className="flex items-center gap-3 px-6 py-4 rounded-xl bg-secondary">
          <span className={`score-display ${getResultColor(match.homeScore, match.awayScore, true)}`}>
            {match.homeScore}
          </span>
          <span className="text-2xl text-secondary-foreground/50">-</span>
          <span className={`score-display ${getResultColor(match.homeScore, match.awayScore, false)}`}>
            {match.awayScore}
          </span>
        </div>

        {/* Away Team */}
        <div className="flex-1 text-center">
          <div className="text-4xl mb-2">{teamLogos[match.awayTeam]}</div>
          <h3 className="font-display text-lg font-semibold text-foreground truncate">
            {match.awayTeam}
          </h3>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Away</span>
        </div>
      </div>

      {/* Probability Bars */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Win Probability</span>
          <span className="font-medium text-primary">{match.confidence}% confidence</span>
        </div>
        
        <div className="flex gap-1 h-3 rounded-full overflow-hidden bg-muted">
          <div 
            className="bg-result-win transition-all duration-700 rounded-l-full"
            style={{ width: `${match.homeWinProb}%` }}
            title={`Home: ${match.homeWinProb}%`}
          />
          <div 
            className="bg-result-draw transition-all duration-700"
            style={{ width: `${match.drawProb}%` }}
            title={`Draw: ${match.drawProb}%`}
          />
          <div 
            className="bg-result-lose transition-all duration-700 rounded-r-full"
            style={{ width: `${match.awayWinProb}%` }}
            title={`Away: ${match.awayWinProb}%`}
          />
        </div>

        <div className="flex justify-between text-xs">
          <span className="text-result-win font-medium">{match.homeWinProb}% Home</span>
          <span className="text-result-draw font-medium">{match.drawProb}% Draw</span>
          <span className="text-result-lose font-medium">{match.awayWinProb}% Away</span>
        </div>
      </div>

      {/* Stadium */}
      <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 text-muted-foreground text-sm">
        <MapPin className="w-4 h-4" />
        <span>{match.stadium}</span>
      </div>
    </div>
  );
};
