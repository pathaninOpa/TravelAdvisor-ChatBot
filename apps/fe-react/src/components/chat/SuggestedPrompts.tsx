import { MapPin, Calendar, Camera, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SuggestedPromptsProps {
  onPromptClick: (prompt: string) => void;
  className?: string;
}

const prompts = [
  {
    icon: MapPin,
    text: "Best destinations for summer 2024",
    gradient: "bg-gradient-ocean"
  },
  {
    icon: Calendar,
    text: "When to visit Japan for cherry blossoms?",
    gradient: "bg-gradient-nature"
  },
  {
    icon: Camera,
    text: "Hidden gems in Europe for photography",
    gradient: "bg-gradient-sunset"
  },
  {
    icon: Compass,
    text: "Adventure activities in New Zealand",
    gradient: "bg-gradient-sky"
  }
];

export const SuggestedPrompts = ({ onPromptClick, className }: SuggestedPromptsProps) => {
  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-sm font-medium text-muted-foreground mb-3">
        Try asking about:
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {prompts.map((prompt, index) => (
          <Button
            key={index}
            variant="outline"
            onClick={() => onPromptClick(prompt.text)}
            className={cn(
              "h-auto p-4 text-left justify-start space-x-3 hover:shadow-soft transition-all duration-300",
              "border-border hover:border-primary/50 group"
            )}
          >
            <div className={cn(
              "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-white",
              prompt.gradient
            )}>
              <prompt.icon className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
              {prompt.text}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};