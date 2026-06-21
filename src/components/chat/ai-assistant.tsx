"use client";

import * as React from 'react';
import { Send, User, Globe, RefreshCw, Mic, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { businessAssistant } from '@/ai/flows/business-assistant-flow';
import { translateText } from '@/ai/flows/translate-flow';
import { useLanguage } from '@/context/language-context';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type Message = {
  role: 'user' | 'model' | 'system';
  content: string;
  translatedContent?: string;
  isTranslating?: boolean;
  showTranslated?: boolean;
};

const STORAGE_KEY = 'ontapp_assistant_pos';

export function AIAssistant() {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);

  // Draggable State with Persistence
  const [position, setPosition] = React.useState({ x: 20, y: 150 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = React.useState(false);

  // Load saved position on mount
  React.useEffect(() => {
    const savedPos = localStorage.getItem(STORAGE_KEY);
    if (savedPos) {
      try {
        setPosition(JSON.parse(savedPos));
      } catch (e) {
        console.error("Failed to load assistant position", e);
      }
    }
  }, []);

  React.useEffect(() => {
    setMessages([{ role: 'model', content: t('ai_greet') }]);
  }, [language, t]);

  React.useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-ai-assistant', handleOpen);
    return () => window.removeEventListener('open-ai-assistant', handleOpen);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    setHasMoved(false);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    // Boundary check
    const boundedX = Math.min(Math.max(10, newX), window.innerWidth - 70);
    const boundedY = Math.min(Math.max(10, newY), window.innerHeight - 70);
    
    setPosition({ x: boundedX, y: boundedY });
    if (Math.abs(e.clientX - (dragStart.x + position.x)) > 5) {
      setHasMoved(true);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    
    if (hasMoved) {
      // Save position to localStorage after drag ends
      localStorage.setItem(STORAGE_KEY, JSON.stringify(position));
    } else {
      // It was a tap, toggle open
      setIsOpen(!isOpen);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    try {
      const { response } = await businessAssistant({ 
        message: input, 
        history: messages.slice(-5).map(m => ({ role: m.role, content: m.content })) 
      });
      setMessages((prev) => [...prev, { role: 'model', content: response }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'model', content: t('ai_error') }]);
    } finally {
      setLoading(false);
    }
  };

  const handleTranslateMessage = async (index: number) => {
    const msg = messages[index];
    if (msg.translatedContent) {
      setMessages(prev => prev.map((m, i) => i === index ? { ...m, showTranslated: !m.showTranslated } : m));
      return;
    }
    setMessages(prev => prev.map((m, i) => i === index ? { ...m, isTranslating: true } : m));
    try {
      const { translatedText } = await translateText({ text: msg.content, targetLanguage: language });
      setMessages(prev => prev.map((m, i) => i === index ? { ...m, translatedContent: translatedText, showTranslated: true, isTranslating: false } : m));
    } catch (err) {
      setMessages(prev => prev.map((m, i) => i === index ? { ...m, isTranslating: false } : m));
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast({ variant: "destructive", title: "Browser Tidak Mendukung", description: "Gunakan Chrome atau Safari untuk fitur Voice Search." });
      return;
    }
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = language === 'id' ? 'id-ID' : 'en-US';
    recognition.onstart = () => toast({ title: "Asisten Mendengarkan..." });
    recognition.onresult = (event: any) => setInput(event.results[0][0].transcript);
    recognition.start();
  };

  return (
    <>
      {/* Floating Draggable Bubble */}
      <div 
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          touchAction: 'none'
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={cn(
          "fixed z-[250] size-14 rounded-full bg-black text-white flex items-center justify-center shadow-2xl cursor-grab active:cursor-grabbing transition-transform active:scale-95 border-2 border-white/20",
          isDragging && "opacity-80 scale-110 shadow-black/40"
        )}
      >
        <div className="relative">
          <User className="size-7" />
          <div className="absolute -top-1 -right-1 size-3 bg-emerald-500 rounded-full border-2 border-black animate-pulse" />
        </div>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/20 backdrop-blur-[2px] animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <Card 
            className="w-full max-sm h-[550px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] rounded-[2.5rem] border-none flex flex-col overflow-hidden bg-card animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="bg-black text-white p-6 flex flex-row items-center justify-between border-none">
              <div className="flex items-center gap-4">
                <div className="size-11 rounded-2xl bg-white/10 flex items-center justify-center shadow-inner">
                  <User className="size-6" />
                </div>
                <div className="flex flex-col">
                  <CardTitle className="text-[16px] font-black tracking-tight leading-none uppercase">Tapp Assistant</CardTitle>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{t('ai_active')}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-white/40 hover:text-white font-black text-[10px] uppercase tracking-widest transition-colors"
              >
                Tutup
              </button>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-hidden p-0 bg-muted/5">
              <ScrollArea className="h-full px-6 py-6">
                <div className="space-y-6 pb-4">
                  {messages.map((msg, i) => (
                    <div key={i} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                      <Avatar className="size-9 border border-border shadow-sm shrink-0 rounded-xl">
                        <AvatarFallback className={cn("flex items-center justify-center rounded-xl", msg.role === 'user' ? "bg-slate-100 text-slate-900" : "bg-black text-white")}>
                          <User className="size-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className={cn("flex flex-col gap-2", msg.role === 'user' ? "items-end" : "items-start", "max-w-[80%]")}>
                        <div className={cn(
                          "p-4 rounded-[1.25rem] text-[14px] md:text-[15px] font-medium shadow-sm leading-snug", 
                          msg.role === 'user' 
                            ? "bg-black text-white rounded-tr-none" 
                            : "bg-white text-slate-700 border border-border/50 rounded-tl-none"
                        )}>
                          {msg.showTranslated ? msg.translatedContent : msg.content}
                        </div>
                        <button 
                          onClick={() => handleTranslateMessage(i)} 
                          className={cn(
                            "transition-all active:scale-75 flex items-center p-1.5 rounded-full bg-muted/10", 
                            msg.showTranslated ? "text-black" : "text-muted-foreground hover:text-black"
                          )}
                        >
                          {msg.isTranslating ? <RefreshCw className="size-3.5 animate-spin" /> : <Globe className="size-3.5" />}
                        </button>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex gap-3">
                      <Avatar className="size-9 border bg-black/5 rounded-xl">
                        <AvatarFallback className="text-black rounded-xl"><User className="size-4" /></AvatarFallback>
                      </Avatar>
                      <div className="bg-white border border-border/50 p-5 rounded-[1.25rem] rounded-tl-none flex gap-2 items-center shadow-sm">
                        <div className="size-1.5 bg-black/30 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="size-1.5 bg-black/30 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="size-1.5 bg-black/30 rounded-full animate-bounce" />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>

            <CardFooter className="p-5 bg-white border-t border-border/50">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
                className="flex w-full gap-2 bg-muted/20 p-1.5 rounded-2xl border border-border/50 items-center focus-within:border-black/30 transition-all shadow-inner"
              >
                <Input 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)} 
                  placeholder={t('ai_ask_strategy')} 
                  className="border-none bg-transparent focus-visible:ring-0 text-[14px] font-medium h-10 px-3" 
                />
                <div className="flex items-center gap-1.5 pr-1">
                  <Button type="button" variant="ghost" size="icon" onClick={handleVoiceInput} className="size-10 rounded-xl text-muted-foreground hover:text-black hover:bg-black/5 shrink-0 transition-all active:scale-90"><Mic className="size-5" /></Button>
                  <Button type="submit" size="icon" disabled={loading || !input.trim()} className="size-10 rounded-xl bg-black hover:bg-black/90 text-white shrink-0 shadow-lg transition-all active:scale-90"><Send className="size-5" /></Button>
                </div>
              </form>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}
