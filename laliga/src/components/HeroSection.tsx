import { Sparkles } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden rounded-2xl mb-8" style={{ background: "var(--gradient-hero)" }}>
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-primary-foreground rounded-full" />
        <div className="absolute bottom-10 right-10 w-48 h-48 border-2 border-primary-foreground rounded-full" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 border border-primary-foreground rounded-full" />
      </div>

      <div className="relative z-10 px-8 py-12 md:py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-foreground mb-4 tracking-tight italic">
          LaLiga Match Predictor
        </h1>

        <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto mb-10">
          Select two teams and let our AI analyze team statistics, form, and historical
          data to predict the most likely outcome.
        </p>

      </div>

      {/* Football pattern overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />
    </section>
  );
};
