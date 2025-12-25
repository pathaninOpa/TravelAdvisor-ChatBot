import { cn } from "@/lib/utils";

interface TypingIndicatorProps {
  className?: string;
}

export const TypingIndicator = ({ className }: TypingIndicatorProps) => {
  return (
    <div className={cn("flex justify-start animate-fade-in", className)}>
      <div className="max-w-[85%] md:max-w-[70%] bg-chat-bot-bg text-chat-bot-text rounded-2xl rounded-bl-md px-4 py-3 shadow-chat border border-border">
        <div className="flex items-center space-x-1">
          <span className="text-sm text-muted-foreground">TravelBuddy is typing</span>
          <div className="flex space-x-1 ml-2">
            <div className="w-2 h-2 bg-chat-typing rounded-full animate-typing-dots"></div>
            <div className="w-2 h-2 bg-chat-typing rounded-full animate-typing-dots" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-chat-typing rounded-full animate-typing-dots" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};