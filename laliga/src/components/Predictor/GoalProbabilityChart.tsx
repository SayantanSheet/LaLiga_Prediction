import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { Info, HelpCircle } from "lucide-react";
import {
    Tooltip as UI_Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface GoalProbabilityChartProps {
    probabilities: {
        over_1_5: number;
        over_2_5: number;
        btts: number;
    };
}

export function GoalProbabilityChart({ probabilities }: GoalProbabilityChartProps) {
    const data = [
        { name: 'Over 1.5 Goals', value: probabilities.over_1_5, color: 'hsl(var(--primary))', description: 'Total goals scored in the match will be 2 or more.' },
        { name: 'Over 2.5 Goals', value: probabilities.over_2_5, color: 'hsl(var(--accent))', description: 'Total goals scored in the match will be 3 or more.' },
        { name: 'BTTS (Yes)', value: probabilities.btts, color: 'hsl(var(--destructive))', description: 'Both teams will score at least one goal each.' },
    ];

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-card border border-border p-3 rounded-lg shadow-xl backdrop-blur-md">
                    <p className="text-sm font-bold text-foreground">{payload[0].payload.name}</p>
                    <p className="text-2xl font-black text-primary">{payload[0].value}%</p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">{payload[0].payload.description}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                    <div className="h-6 w-1 rounded-full bg-accent" />
                    <h3 className="text-xl font-bold tracking-tight text-foreground">Goal Probability Analysis</h3>
                </div>

                <TooltipProvider>
                    <UI_Tooltip>
                        <TooltipTrigger asChild>
                            <button className="p-2 rounded-full hover:bg-muted transition-colors">
                                <HelpCircle className="w-5 h-5 text-muted-foreground" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="max-w-xs p-4 space-y-2">
                            <p className="font-bold border-b border-border pb-1 mb-2">Mathematical Logic</p>
                            <div className="space-y-2 text-xs">
                                <p><span className="font-bold text-primary">Over 1.5:</span> P(Goals ≥ 2) calculated from Poisson distribution grid.</p>
                                <p><span className="font-bold text-accent">Over 2.5:</span> P(Goals ≥ 3) based on cumulative probability.</p>
                                <p><span className="font-bold text-destructive">BTTS:</span> Both Teams To Score. P(Home ≥ 1 ∩ Away ≥ 1).</p>
                            </div>
                        </TooltipContent>
                    </UI_Tooltip>
                </TooltipProvider>
            </div>

            <div className="relative p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm shadow-sm overflow-hidden">
                <div className="h-[300px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                            layout="vertical"
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" opacity={0.3} />
                            <XAxis
                                type="number"
                                domain={[0, 100]}
                                hide
                            />
                            <YAxis
                                dataKey="name"
                                type="category"
                                width={120}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'hsl(var(--foreground))', fontSize: 12, fontWeight: 600 }}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--primary)/0.05)' }} />
                            <Bar
                                dataKey="value"
                                radius={[0, 8, 8, 0]}
                                barSize={40}
                                animationDuration={1500}
                                animationBegin={300}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                                <LabelList
                                    dataKey="value"
                                    position="right"
                                    formatter={(val: number) => `${val}%`}
                                    style={{ fill: 'hsl(var(--foreground))', fontSize: 14, fontWeight: 800 }}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {data.map((item) => (
                        <div key={item.name} className="p-4 rounded-xl bg-background/50 border border-border/50 flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">{item.name}</span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black text-foreground">{item.value}%</span>
                                <span className="text-[10px] text-muted-foreground">Likelihood</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-4 rounded-xl border border-border/50 bg-muted/20 flex gap-3 items-start">
                <Info className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                    Probabilities are derived from the Poisson Distribution model, which estimates the likelihood of specific scorelines based on the teams' historical scoring and conceding frequencies in home and away conditions.
                </p>
            </div>
        </div>
    );
}
