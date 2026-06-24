"use client";

import * as React from 'react';
import { Send, User, Globe, RefreshCw, Mic, Sparkles, X as XIcon } from 'lucide-react';
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

const STORAGE_KEY = 'ontapp_assistant_pos_v2';

export function AIAssistant() {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);

  // Default position: Bottom right
  const [position, setPosition] = React.useState({ x: 300, y: 500 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const [dragDistance, setDragDistance] = React.useState(0);

  // Guard to ensure we're on client
  const [isMounted, setIsMounted] = React.useState(false);

  const clampPosition = React.useCallback((x: number, y: number) => {
    if (typeof window === 'undefined') return { x, y };
    // Margin of 10px from edges
    const maxX = window.innerWidth - 70; 
    const maxY = window.innerHeight - 140; // Avoid overlapping bottom nav
    return {
      x: Math.min(Math.max(10, x), maxX),
      y: Math.min(Math.max(60, y), maxY) // Avoid overlapping top header
    };
  }, []);

  React.useEffect(() => {
    setIsMounted(true);
    const savedPos = localStorage.getItem(STORAGE_KEY);
    
    // Initial centering/clamping
    let initialX = window.innerWidth - 80;
    let initialY = window.innerHeight - 150;

    if (savedPos) {
      try {
        const parsed = JSON.parse(savedPos);
        const clamped = clampPosition(parsed.x, parsed.y);
        setPosition(clamped);
      } catch (e) {
        setPosition(clampPosition(initialX, initialY));
      }
    } else {
      setPosition(clampPosition(initialX, initialY));
    }

    const handleResize = () => {
      setPosition(prev => clampPosition(prev.x, prev.y));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [clampPosition]);

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
    setDragDistance(0);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    // Calculate distance moved
    const dx = newX - position.x;
    const dy = newY - position.y;
    setDragDistance(prev => prev + Math.sqrt(dx * dx + dy * dy));

    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    
    const finalPos = clampPosition(position.x, position.y);
    setPosition(finalPos);
    
    // If moved more than 10 pixels, save position. Otherwise, it's a click.
    if (dragDistance > 10) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(finalPos));
    } else {
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
    if (typeof window === 'undefined' || !('webkitSpeechRecognition' in window)) {
      toast({ variant: "destructive", title: "Browser Tidak Mendukung", description: "Gunakan Chrome atau Safari untuk fitur Voice Search." });
      return;
    }
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = language === 'id' ? 'id-ID' : 'en-US';
    recognition.onstart = () => toast({ title: "Asisten Mendengarkan..." });
    recognition.onresult = (event: any) => setInput(event.results[0][0].transcript);
    recognition.start();
  };

  if (!isMounted) return null;

  return (
    <>
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
          "fixed z-[300] size-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-[0_15px_40px_rgba(37,99,235,0.4)] cursor-grab active:cursor-grabbing transition-all hover:scale-105 border-2 border-white/20 group",
          isDragging && "opacity-80 scale-110 shadow-primary/60"
        )}
      >
        <div className="relative group-hover:rotate-12 transition-transform">
          <User className="size-7" />
          <div className="absolute -top-1 -right-1 size-3 bg-emerald-400 rounded-full border-2 border-primary animate-pulse" />
        </div>
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        >
          <Card 
            className="w-full max-w-sm h-[550px] shadow-2xl rounded-[2rem] border-none flex flex-col overflow-hidden bg-card animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="bg-primary text-primary-foreground p-5 flex flex-row items-center justify-between border-none">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center shadow-inner">
                  <User className="size-5" />
                </div>
                <div className="flex flex-col">
                  <CardTitle className="text-base font-black tracking-tight leading-none uppercase">Tapp Intelligence</CardTitle>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">{t('ai_active')}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="size-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all active:scale-90"
              >
                <XIcon className="size-4" />
              </button>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-hidden p-0 bg-slate-50/50">
              <ScrollArea className="h-full px-5 py-6">
                <div className="space-y-6 pb-4">
                  {messages.map((msg, i) => (
                    <div key={i} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                      <Avatar className="size-8 border border-border shadow-sm shrink-0 rounded-xl">
                        <AvatarFallback className={cn("flex items-center justify-center rounded-xl font-black text-[10px]", msg.role === 'user' ? "bg-primary/5 text-primary" : "bg-primary text-primary-foreground")}>
                          {msg.role === 'user' ? 'ME' : 'AI'}
                        </AvatarFallback>
                      </Avatar>
                      <div className={cn("flex flex-col gap-2", msg.role === 'user' ? "items-end" : "items-start", "max-w-[85%]")}>
                        <div className={cn(
                          "p-4 rounded-2xl text-[13px] font-medium shadow-sm leading-relaxed", 
                          msg.role === 'user' 
                            ? "bg-primary text-primary-foreground rounded-tr-none" 
                            : "bg-white text-slate-700 border border-border/40 rounded-tl-none"
                        )}>
                          {msg.showTranslated ? msg.translatedContent : msg.content}
                        </div>
                        <button 
                          onClick={() => handleTranslateMessage(i)} 
                          className={cn(
                            "transition-all active:scale-75 flex items-center gap-1.5 p-1.5 rounded-lg bg-white border border-border/40 shadow-sm", 
                            msg.showTranslated ? "text-primary border-primary/20" : "text-muted-foreground hover:text-primary"
                          )}
                        >
                          {msg.isTranslating ? <RefreshCw className="size-3 animate-spin" /> : <Globe className="size-3" />}
                          <span className="text-[8px] font-black uppercase tracking-widest">{msg.showTranslated ? 'Original' : 'Translate'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex gap-3">
                      <Avatar className="size-8 border bg-primary/5 rounded-xl">
                        <AvatarFallback className="text-primary rounded-xl font-black text-[10px]">AI</AvatarFallback>
                      </Avatar>
                      <div className="bg-white border border-border/40 p-4 rounded-2xl rounded-tl-none flex gap-1.5 items-center shadow-sm">
                        <div className="size-1.5 bg-primary/30 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="size-1.5 bg-primary/30 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="size-1.5 bg-primary/30 rounded-full animate-bounce" />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>

            <CardFooter className="p-4 bg-white border-t border-border/40">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
                className="flex w-full gap-2 bg-slate-50 p-1.5 rounded-xl border border-border/60 items-center focus-within:ring-2 focus-within:ring-primary/5 transition-all shadow-inner"
              >
                <Input 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)} 
                  placeholder={t('ai_ask_strategy')} 
                  className="border-none bg-transparent focus-visible:ring-0 text-[13px] font-medium h-9 px-3" 
                />
                <div className="flex items-center gap-1">
                  <Button type="button" variant="ghost" size="icon" onClick={handleVoiceInput} className="size-9 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 shrink-0 active:scale-90 transition-all"><Mic className="size-4" /></Button>
                  <Button type="submit" size="icon" disabled={loading || !input.trim()} className="size-9 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 shadow-md active:scale-90 transition-all"><Send className="size-4" /></Button>
                </div>
              </form>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}
