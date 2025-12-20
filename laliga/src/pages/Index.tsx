import { useState, useEffect } from "react";
import { HeroSection } from "@/components/HeroSection";

import { MatchCard } from "@/components/MatchCard";
import { ModelInfo } from "@/components/ModelInfo";
import { TeamSelector } from "@/components/Predictor/TeamSelector";
import { PredictionResultCard } from "@/components/Predictor/PredictionResult";
import { api, PredictionResult, Match } from "@/api/client";
import { Loader2, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [matches, setMatches] = useState<Match[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await api.getMatches();
        setMatches(data);
      } catch (e) {
        console.log("Failed to load initial matches");
      }
    };
    fetchMatches();
  }, []);

  const handlePredict = async (home: string, away: string) => {
    setIsLoading(true);
    setPrediction(null);
    try {
      const result = await api.predictMatch(home, away);
      setPrediction(result);
      // Scroll to result
      const element = document.getElementById("prediction-result");
      if (element) element.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error(error);
      toast({
        title: "Prediction Failed",
        description: "Could not generate prediction. Ensure backend is running.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      await api.refreshData();
      const updatedMatches = await api.getMatches();
      setMatches(updatedMatches);
      toast({
        title: "Data Refreshed",
        description: "Latest LaLiga match data has been fetched.",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Could not fetch new data.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const sortedMatches = [...matches].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const now = new Date();
  const upcomingMatches = sortedMatches.filter(m => new Date(m.date + 'T' + m.time) > now);
  // Fallback to recent matches if no upcoming ones
  const displayedUpcoming = upcomingMatches.length > 0 ? upcomingMatches.slice(0, 4) : [];
  // Use recent matches for display if we have no upcoming
  const displayMatches = displayedUpcoming.length > 0 ? displayedUpcoming : sortedMatches.slice(-4);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-16">

        {/* Header / Hero */}
        <section className="relative">
          <div className="absolute top-0 right-0 z-20">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefreshData}
              disabled={isRefreshing}
              className="text-muted-foreground hover:text-primary"
            >
              <RotateCw className={isRefreshing ? "animate-spin mr-2" : "mr-2"} size={16} />
              {isRefreshing ? "Updating Data..." : "Refresh Data"}
            </Button>
          </div>
          <HeroSection />
        </section>

        {/* Prediction Interface */}
        <section id="predictor" className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-display font-bold uppercase tracking-tight">
              Match <span className="text-primary">Predictor</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Select two teams to generate an AI-powered prediction based on real-time historical performance and Poisson distribution analysis.
            </p>
          </div>

          <TeamSelector onPredict={handlePredict} isLoading={isLoading} />

          {/* Result Area */}
          <div id="prediction-result" className="min-h-[100px] scroll-mt-24">
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4 text-muted-foreground">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p>Analyzing historical data...</p>
              </div>
            )}

            {prediction && (
              <PredictionResultCard result={prediction} />
            )}
          </div>
        </section>

        {/* Recent/Upcoming Fixtures (Legacy) */}
        <section className="bg-muted/20 -mx-4 px-4 py-16">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-display font-bold">Latest Fixtures</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayMatches.map((match, index) => (
                <MatchCard key={match.id} match={match} index={index} />
              ))}
            </div>
          </div>
        </section>

        <ModelInfo />

        <footer className="text-center py-8 text-muted-foreground text-sm border-t border-border">
          <p>© 2025 LaLiga Predictor Pro</p>
          <p className="text-xs mt-1 opacity-50">Predictions are statistical estimates, not guarantees.</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
