import { cn } from '@/lib/utils';
import { Message } from '@/types/kitchen';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant';
  
  return (
    <div 
      className={cn(
        'animate-fade-in',
        isAssistant ? 'self-start' : 'self-end'
      )}
      style={{ animationDelay: '0.1s' }}
    >
      <div 
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-3 shadow-soft',
          isAssistant 
            ? 'bg-card text-card-foreground rounded-tl-sm' 
            : 'bg-primary text-primary-foreground rounded-tr-sm'
        )}
      >
        <div className="whitespace-pre-wrap text-[15px] leading-relaxed">
          {message.content}
        </div>
      </div>
    </div>
  );
}
