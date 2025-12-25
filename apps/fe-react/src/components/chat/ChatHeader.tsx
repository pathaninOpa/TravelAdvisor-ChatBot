import { Plane, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

interface ChatHeaderProps {
  onClearChat: () => void;
  messageCount: number;
  className?: string;
}

export const ChatHeader = ({ onClearChat, messageCount, className }: ChatHeaderProps) => {
  return (
    <header className={cn(
      "border-b border-border bg-background/95 backdrop-blur-sm p-4",
      className
    )}>
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-sky rounded-lg flex items-center justify-center shadow-soft">
            <Plane className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">TravelBuddy</h1>
            <p className="text-sm text-muted-foreground">Your AI Travel Companion</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          {messageCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearChat}
              className="hover:bg-muted transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};