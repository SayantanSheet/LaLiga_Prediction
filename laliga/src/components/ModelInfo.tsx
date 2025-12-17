import { Brain, GitBranch, Database, Gauge } from "lucide-react";

const features = [
  {
    icon: <Brain className="w-6 h-6" />,
    title: "Random Forest",
    description: "Ensemble learning model trained on historical La Liga data",
  },
  {
    icon: <Database className="w-6 h-6" />,
    title: "10+ Years Data",
    description: "Analysis of over 3,800 matches with detailed statistics",
  },
  {
    icon: <GitBranch className="w-6 h-6" />,
    title: "Feature Engineering",
    description: "50+ features including form, H2H, and player metrics",
  },
  {
    icon: <Gauge className="w-6 h-6" />,
    title: "Real-time Updates",
    description: "Model retrained weekly with latest match results",
  },
];

export const ModelInfo = () => {
  return (
    <section className="mt-12 p-8 rounded-2xl bg-card card-shadow">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
          How It Works
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our prediction model uses traditional ML techniques to analyze historical 
          match data and generate accurate score predictions.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="text-center p-6 rounded-xl bg-background border border-border hover:border-primary/30 transition-colors duration-300"
          >
            <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-4">
              {feature.icon}
            </div>
            <h3 className="font-display font-semibold text-foreground mb-2">
              {feature.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Tech Stack */}
      <div className="mt-8 pt-8 border-t border-border">
        <div className="flex flex-wrap justify-center gap-3">
          {["Python", "Scikit-learn", "Pandas", "React", "TypeScript", "Tailwind"].map((tech) => (
            <span 
              key={tech}
              className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
