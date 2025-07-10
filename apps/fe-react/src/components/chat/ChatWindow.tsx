import { useEffect, useRef } from "react";
import { ChatBubble } from "./ChatBubble";
import { TypingIndicator } from "./TypingIndicator";
import { SuggestedPrompts } from "./SuggestedPrompts";
import { ChatMessage } from "@/types/chat";
import { cn } from "@/lib/utils";

interface ChatWindowProps {
  messages: ChatMessage[];
  isTyping: boolean;
  onPromptClick: (prompt: string) => void;
  className?: string;
}

export const ChatWindow = ({ messages, isTyping, onPromptClick, className }: ChatWindowProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className={cn(
      "flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-background",
      className
    )}>
      <div className="max-w-4xl mx-auto space-y-6">
        {messages.length === 0 ? (
          <div className="space-y-8">
            <div className="text-center space-y-4 py-8">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-sky bg-clip-text text-transparent">
                Welcome to TravelBuddy! ✈️
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Your AI travel companion is here to help you discover amazing destinations, 
                plan your perfect trip, and find hidden gems around the world.
              </p>
            </div>
            <SuggestedPrompts onPromptClick={onPromptClick} />
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                message={message.message}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            ))}
            {isTyping && <TypingIndicator />}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};