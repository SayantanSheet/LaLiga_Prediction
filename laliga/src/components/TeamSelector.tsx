import { useState } from "react";
import { Sparkles } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { laLigaTeams, teamLogos } from "@/data/matches";

interface PredictionResult {
  homeWinProb: number;
  drawProb: number;
  awayWinProb: number;
  predictedHomeScore: number;
  predictedAwayScore: number;
  confidence: number;
}

export const TeamSelector = () => {
  const [homeTeam, setHomeTeam] = useState<string>("");
  const [awayTeam, setAwayTeam] = useState<string>("");
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePredict = async () => {
    if (!homeTeam || !awayTeam) return;
    
    setIsLoading(true);
    
    // Simulated prediction (replace with actual API call to your Python ML backend)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock prediction logic based on team strength
    const teamStrength: Record<string, number> = {
      "Real Madrid": 95,
      "Barcelona": 93,
      "Atlético Madrid": 88,
      "Athletic Bilbao": 82,
      "Girona": 80,
      "Real Sociedad": 79,
      "Real Betis": 77,
      "Villarreal": 78,
      "Valencia": 75,
      "Sevilla": 76,
      "Getafe": 70,
      "Osasuna": 72,
      "Alavés": 68,
      "Celta Vigo": 71,
      "Mallorca": 70,
      "Rayo Vallecano": 69,
      "Las Palmas": 67,
      "Granada": 65,
      "Almería": 64,
      "Cádiz": 63,
    };
    
    const homeStrength = teamStrength[homeTeam] || 70;
    const awayStrength = teamStrength[awayTeam] || 70;
    const homeAdvantage = 5;
    
    const totalStrength = homeStrength + homeAdvantage + awayStrength;
    const homeWinBase = (homeStrength + homeAdvantage) / totalStrength;
    const awayWinBase = awayStrength / totalStrength;
    
    const homeWinProb = Math.round(homeWinBase * 100 * 0.85);
    const awayWinProb = Math.round(awayWinBase * 100 * 0.85);
    const drawProb = 100 - homeWinProb - awayWinProb;
    
    const avgGoals = 2.7;
    const predictedHomeScore = Math.round((homeStrength + homeAdvantage) / 40 + Math.random() * 0.5);
    const predictedAwayScore = Math.round(awayStrength / 45 + Math.random() * 0.5);
    
    setPrediction({
      homeWinProb,
      drawProb,
      awayWinProb,
      predictedHomeScore,
      predictedAwayScore,
      confidence: Math.round(60 + Math.random() * 25),
    });
    
    setIsLoading(false);
  };

  const getWinner = () => {
    if (!prediction) return null;
    if (prediction.homeWinProb > prediction.awayWinProb && prediction.homeWinProb > prediction.drawProb) {
      return "home";
    } else if (prediction.awayWinProb > prediction.homeWinProb && prediction.awayWinProb > prediction.drawProb) {
      return "away";
    }
    return "draw";
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Team Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-semibold text-emerald-400 mb-2 uppercase tracking-wider">
            Home Team
          </label>
          <Select value={homeTeam} onValueChange={setHomeTeam}>
            <SelectTrigger className="w-full h-14 bg-card/80 border-border text-foreground text-lg">
              <SelectValue placeholder="Select a team..." />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {laLigaTeams.filter(team => team !== awayTeam).map((team) => (
                <SelectItem key={team} value={team} className="text-foreground hover:bg-muted">
                  <span className="flex items-center gap-2">
                    <span>{teamLogos[team]}</span>
                    <span>{team}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-accent mb-2 uppercase tracking-wider">
            Away Team
          </label>
          <Select value={awayTeam} onValueChange={setAwayTeam}>
            <SelectTrigger className="w-full h-14 bg-card/80 border-border text-foreground text-lg">
              <SelectValue placeholder="Select a team..." />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {laLigaTeams.filter(team => team !== homeTeam).map((team) => (
                <SelectItem key={team} value={team} className="text-foreground hover:bg-muted">
                  <span className="flex items-center gap-2">
                    <span>{teamLogos[team]}</span>
                    <span>{team}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Predict Button */}
      <div className="flex justify-center mb-8">
        <Button
          onClick={handlePredict}
          disabled={!homeTeam || !awayTeam || isLoading}
          className="px-8 py-6 text-lg font-semibold bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg transition-all duration-300 disabled:opacity-50"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          {isLoading ? "Predicting..." : "Predict Match"}
        </Button>
      </div>

      {/* Prediction Result */}
      {prediction && homeTeam && awayTeam && (
        <div className="bg-card/60 backdrop-blur-sm border border-border rounded-xl p-6 animate-fade-in">
          <h3 className="text-center text-muted-foreground text-sm uppercase tracking-wider mb-4">
            Prediction Result
          </h3>
          
          {/* Score Prediction */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className={`text-center ${getWinner() === "home" ? "scale-110" : "opacity-80"} transition-all`}>
              <span className="text-3xl mb-2 block">{teamLogos[homeTeam]}</span>
              <p className="font-semibold text-foreground">{homeTeam}</p>
              <p className="text-4xl font-display font-bold text-foreground mt-2">
                {prediction.predictedHomeScore}
              </p>
            </div>
            
            <div className="text-center px-4">
              <span className="text-2xl text-muted-foreground font-bold">VS</span>
            </div>
            
            <div className={`text-center ${getWinner() === "away" ? "scale-110" : "opacity-80"} transition-all`}>
              <span className="text-3xl mb-2 block">{teamLogos[awayTeam]}</span>
              <p className="font-semibold text-foreground">{awayTeam}</p>
              <p className="text-4xl font-display font-bold text-foreground mt-2">
                {prediction.predictedAwayScore}
              </p>
            </div>
          </div>

          {/* Probability Bars */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-24">Home Win</span>
              <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${prediction.homeWinProb}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-foreground w-12 text-right">
                {prediction.homeWinProb}%
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-24">Draw</span>
              <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                  style={{ width: `${prediction.drawProb}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-foreground w-12 text-right">
                {prediction.drawProb}%
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-24">Away Win</span>
              <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent rounded-full transition-all duration-500"
                  style={{ width: `${prediction.awayWinProb}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-foreground w-12 text-right">
                {prediction.awayWinProb}%
              </span>
            </div>
          </div>

          {/* Confidence */}
          <div className="mt-4 pt-4 border-t border-border text-center">
            <span className="text-sm text-muted-foreground">Model Confidence: </span>
            <span className="text-sm font-semibold text-primary">{prediction.confidence}%</span>
          </div>
        </div>
      )}
    </div>
  );
};
