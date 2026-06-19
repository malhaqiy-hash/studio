'use client';

import * as React from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Minimize2, 
  Maximize2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { businessAssistant } from '@/ai/flows/business-assistant-flow';
import { cn } from '@/lib/utils';

type Message = {
  role: 'user' | 'model' | 'system';
  content: string;
};

export function AIAssistant() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([
    { 
      role: 'model', 
      content: 'Hello! I am your OnTapp Strategic Assistant. How can I help you optimize your business network today?' 
    }
  ]);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const { response } = await businessAssistant({
        message: input,
        history: messages.slice(-5) // Send last few messages for context
      });

      setMessages((prev) => [...prev, { role: 'model', content: response }]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages((prev) => [
        ...prev, 
        { role: 'model', content: 'I apologize, but I encountered an error. Please try again shortly.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {isOpen && (
        <Card className="w-80 md:w-96 h-[500px] shadow-2xl rounded-3xl border-slate-200 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-300">
          <CardHeader className="bg-slate-900 text-white p-4 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-accent flex items-center justify-center">
                <Sparkles className="size-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-sm font-black tracking-tight">OnTapp AI Advisor</CardTitle>
                <div className="flex items-center gap-1.5">
                  <div className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Consultant</span>
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white hover:bg-white/10 rounded-full"
            >
              <X className="size-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-hidden p-0 bg-slate-50/50">
            <ScrollArea className="h-full p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "flex gap-3",
                      msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <Avatar className="size-8 border">
                      {msg.role === 'user' ? (
                        <>
                          <AvatarImage src="https://picsum.photos/seed/user/100" />
                          <AvatarFallback><User className="size-4" /></AvatarFallback>
                        </>
                      ) : (
                        <>
                          <AvatarFallback className="bg-indigo-50 text-accent"><Bot className="size-4" /></AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    <div className={cn(
                      "max-w-[80%] p-3 rounded-2xl text-sm font-medium shadow-sm",
                      msg.role === 'user' 
                        ? "bg-accent text-white rounded-tr-none" 
                        : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                    )}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-3">
                    <Avatar className="size-8 border">
                      <AvatarFallback className="bg-indigo-50 text-accent"><Bot className="size-4" /></AvatarFallback>
                    </Avatar>
                    <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none flex gap-1">
                      <div className="size-1.5 bg-slate-300 rounded-full animate-bounce" />
                      <div className="size-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="size-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>

          <CardFooter className="p-4 bg-white border-t">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex w-full gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 focus-within:ring-2 focus-within:ring-accent/10 transition-all"
            >
              <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about strategy..." 
                className="border-none bg-transparent focus-visible:ring-0 shadow-none font-medium text-sm"
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={loading || !input.trim()}
                className="rounded-xl bg-slate-900 hover:bg-black text-white shrink-0"
              >
                <Send className="size-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}

      <Button
        size="lg"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "size-14 rounded-full shadow-2xl transition-all duration-300 active:scale-90",
          isOpen ? "bg-slate-900 hover:bg-black" : "bg-accent hover:bg-indigo-600"
        )}
      >
        {isOpen ? <X className="size-6" /> : <MessageSquare className="size-6" />}
      </Button>
    </div>
  );
}
