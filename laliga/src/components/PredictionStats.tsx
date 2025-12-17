import { TrendingUp, Target, Zap, BarChart3 } from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: string;
}

const StatCard = ({ icon, label, value, trend }: StatCardProps) => (
  <div className="bg-card rounded-xl p-5 card-shadow hover:elevated-shadow transition-shadow duration-300">
    <div className="flex items-start justify-between mb-3">
      <div className="p-2 rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      {trend && (
        <span className="text-xs text-result-win font-medium flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          {trend}
        </span>
      )}
    </div>
    <p className="text-2xl font-display font-bold text-foreground">{value}</p>
    <p className="text-sm text-muted-foreground mt-1">{label}</p>
  </div>
);

export const PredictionStats = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        icon={<Target className="w-5 h-5" />}
        label="Accuracy Rate"
        value="78.5%"
        trend="+2.3%"
      />
      <StatCard
        icon={<BarChart3 className="w-5 h-5" />}
        label="Matches Analyzed"
        value="1,247"
      />
      <StatCard
        icon={<Zap className="w-5 h-5" />}
        label="Avg Confidence"
        value="67%"
        trend="+5%"
      />
      <StatCard
        icon={<TrendingUp className="w-5 h-5" />}
        label="Correct This Week"
        value="8/10"
        trend="+3"
      />
    </div>
  );
};
