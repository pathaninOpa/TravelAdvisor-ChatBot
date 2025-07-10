import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
  className?: string;
}

export const ChatBubble = ({ message, isUser, timestamp, className }: ChatBubbleProps) => {
  return (
    <div
      className={cn(
        "flex w-full animate-slide-up",
        isUser ? "justify-end" : "justify-start",
        className
      )}
    >
      <div
        className={cn(
          "max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 shadow-chat transition-all duration-300 hover:shadow-glow",
          isUser
            ? "bg-chat-user-bg text-chat-user-text rounded-br-md"
            : "bg-green-100 text-gray-700 rounded-bl-md border border-border"
        )}
      >
        <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
          {message}
        </p>
        {timestamp && (
          <p className={cn(
            "text-xs mt-2 opacity-70",
            isUser ? "text-chat-user-text" : "text-muted-foreground"
          )}>
            {timestamp}
          </p>
        )}
      </div>
    </div>
  );
};