import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { api } from "@/api/client";

interface TeamSelectorProps {
    onPredict: (home: string, away: string) => void;
    isLoading: boolean;
}

export function TeamSelector({ onPredict, isLoading }: TeamSelectorProps) {
    const [teams, setTeams] = useState<string[]>([]);
    const [homeTeam, setHomeTeam] = useState<string>("");
    const [awayTeam, setAwayTeam] = useState<string>("");
    const [openHome, setOpenHome] = useState(false);
    const [openAway, setOpenAway] = useState(false);

    useEffect(() => {
        const loadTeams = async () => {
            try {
                const teamList = await api.getTeams();
                setTeams(teamList);
                // Set defaults if available mainly for demo
                if (teamList.includes("Real Madrid") && teamList.includes("Barcelona")) {
                    setHomeTeam("Real Madrid");
                    setAwayTeam("Barcelona");
                }
            } catch (error) {
                console.error("Failed to load teams:", error);
            }
        };
        loadTeams();
    }, []);

    const handlePredict = () => {
        if (homeTeam && awayTeam) {
            onPredict(homeTeam, awayTeam);
        }
    };

    const TeamCombobox = ({ value, onChange, open, setOpen, label }: any) => (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted-foreground">{label}</label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between h-12 text-base"
                    >
                        {value ? teams.find((team) => team === value) : "Select team..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                    <Command>
                        <CommandInput placeholder="Search team..." />
                        <CommandList>
                            <CommandEmpty>No team found.</CommandEmpty>
                            <CommandGroup>
                                {teams.map((team) => (
                                    <CommandItem
                                        key={team}
                                        value={team}
                                        onSelect={(currentValue) => {
                                            onChange(currentValue === value ? "" : currentValue);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === team ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {team}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );

    return (
        <div className="card-shadow bg-card rounded-xl p-6 md:p-8 space-y-6 border border-border/50">
            <div className="grid md:grid-cols-2 gap-6">
                <TeamCombobox
                    value={homeTeam}
                    onChange={setHomeTeam}
                    open={openHome}
                    setOpen={setOpenHome}
                    label="Home Team"
                />
                <TeamCombobox
                    value={awayTeam}
                    onChange={setAwayTeam}
                    open={openAway}
                    setOpen={setOpenAway}
                    label="Away Team"
                />
            </div>

            <Button
                onClick={handlePredict}
                disabled={!homeTeam || !awayTeam || isLoading || homeTeam === awayTeam}
                className="w-full h-12 text-lg font-bold bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(350,90%,30%)] hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
            >
                {isLoading ? "Analyzing..." : "Predict Match Result"}
            </Button>
            {homeTeam === awayTeam && homeTeam && (
                <p className="text-destructive text-center text-sm">Please select different teams.</p>
            )}
        </div>
    );
}
