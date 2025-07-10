import { ChatHeader } from "./chat/ChatHeader";
import { ChatWindow } from "./chat/ChatWindow";
import { ChatInput } from "./chat/ChatInput";
import { useChat } from "@/hooks/useChat";
import { cn } from "@/lib/utils";

interface TravelChatProps {
  className?: string;
}

export const TravelChat = ({ className }: TravelChatProps) => {
  const { messages, isTyping, sendMessage, clearChat } = useChat();

  return (
    <div className={cn(
      "flex flex-col h-screen bg-gradient-background",
      className
    )}>
      <ChatHeader
        onClearChat={clearChat}
        messageCount={messages.length}
      />
      
      <ChatWindow 
        messages={messages}
        isTyping={isTyping}
        onPromptClick={sendMessage}
      />
      
      <ChatInput 
        onSendMessage={sendMessage}
        disabled={isTyping}
      />
    </div>
  );
};