import { HeroSection } from "@/components/HeroSection";
import { PredictionStats } from "@/components/PredictionStats";
import { MatchCard } from "@/components/MatchCard";
import { ModelInfo } from "@/components/ModelInfo";
import { mockMatches } from "@/data/matches";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero */}
        <HeroSection />

        {/* Stats Overview */}
        <section className="mb-10">
          <PredictionStats />
        </section>

        {/* Predictions Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                Match Predictions
              </h2>
              <p className="text-muted-foreground mt-1">
                Upcoming La Liga fixtures with AI-predicted scores
              </p>
            </div>
          </div>

          {/* Match Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {mockMatches.map((match, index) => (
              <MatchCard key={match.id} match={match} index={index} />
            ))}
          </div>
        </section>

        {/* Model Info */}
        <ModelInfo />

        {/* Footer */}
        <footer className="mt-16 py-8 border-t border-border text-center">
          <p className="text-muted-foreground text-sm">
            Predictions are for entertainment purposes only. Not gambling advice.
          </p>
          <p className="text-muted-foreground/60 text-xs mt-2">
            © 2025 LaLiga Predictions • created by sayantan
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
