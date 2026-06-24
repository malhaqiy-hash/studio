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

  const [position, setPosition] = React.useState({ x: 20, y: 150 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = React.useState(false);

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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(position));
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
          "fixed z-[250] size-15 rounded-3xl bg-primary text-primary-foreground flex items-center justify-center shadow-[0_20px_50px_rgba(37,99,235,0.3)] cursor-grab active:cursor-grabbing transition-all active:scale-90 border-2 border-white/20 group",
          isDragging && "opacity-80 scale-110 shadow-primary/40"
        )}
      >
        <div className="relative group-hover:scale-110 transition-transform">
          <User className="size-8" />
          <div className="absolute -top-1 -right-1 size-3.5 bg-emerald-400 rounded-full border-2 border-primary animate-pulse" />
        </div>
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/10 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        >
          <Card 
            className="w-full max-sm h-[600px] shadow-[0_32px_80px_-12px_rgba(0,0,0,0.15)] rounded-[2.5rem] border-none flex flex-col overflow-hidden bg-card animate-in zoom-in-95 duration-400"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="bg-primary text-primary-foreground p-7 flex flex-row items-center justify-between border-none">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-[1.25rem] bg-white/10 flex items-center justify-center shadow-inner group transition-all">
                  <User className="size-6 group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex flex-col">
                  <CardTitle className="text-[18px] font-black tracking-tight leading-none uppercase">Tapp Intelligence</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-black text-white/60 uppercase tracking-widest">{t('ai_active')}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="size-10 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all active:scale-90"
              >
                <RefreshCw className="size-4 rotate-45" />
              </button>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-hidden p-0 bg-slate-50/30">
              <ScrollArea className="h-full px-6 py-8">
                <div className="space-y-8 pb-4">
                  {messages.map((msg, i) => (
                    <div key={i} className={cn("flex gap-4", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                      <Avatar className="size-10 border border-border shadow-sm shrink-0 rounded-2xl">
                        <AvatarFallback className={cn("flex items-center justify-center rounded-2xl font-black", msg.role === 'user' ? "bg-primary/5 text-primary" : "bg-primary text-primary-foreground")}>
                          {msg.role === 'user' ? 'ME' : 'AI'}
                        </AvatarFallback>
                      </Avatar>
                      <div className={cn("flex flex-col gap-2.5", msg.role === 'user' ? "items-end" : "items-start", "max-w-[85%]")}>
                        <div className={cn(
                          "p-5 rounded-[1.5rem] text-[15px] font-medium shadow-sm leading-relaxed", 
                          msg.role === 'user' 
                            ? "bg-primary text-primary-foreground rounded-tr-none" 
                            : "bg-white text-slate-700 border border-border/40 rounded-tl-none"
                        )}>
                          {msg.showTranslated ? msg.translatedContent : msg.content}
                        </div>
                        <button 
                          onClick={() => handleTranslateMessage(i)} 
                          className={cn(
                            "transition-all active:scale-75 flex items-center gap-2 p-2 rounded-xl bg-white border border-border/40 shadow-sm", 
                            msg.showTranslated ? "text-primary border-primary/20" : "text-muted-foreground hover:text-primary"
                          )}
                        >
                          {msg.isTranslating ? <RefreshCw className="size-4 animate-spin" /> : <Globe className="size-4" />}
                          <span className="text-[10px] font-black uppercase tracking-widest">{msg.showTranslated ? 'Original' : 'Translate'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex gap-4">
                      <Avatar className="size-10 border bg-primary/5 rounded-2xl">
                        <AvatarFallback className="text-primary rounded-2xl font-black">AI</AvatarFallback>
                      </Avatar>
                      <div className="bg-white border border-border/40 p-6 rounded-[1.5rem] rounded-tl-none flex gap-2 items-center shadow-sm">
                        <div className="size-2 bg-primary/30 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="size-2 bg-primary/30 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="size-2 bg-primary/30 rounded-full animate-bounce" />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>

            <CardFooter className="p-6 bg-white border-t border-border/40">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
                className="flex w-full gap-3 bg-slate-50 p-2 rounded-2xl border border-border/60 items-center focus-within:ring-4 focus-within:ring-primary/5 focus-within:border-primary/30 transition-all shadow-inner"
              >
                <Input 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)} 
                  placeholder={t('ai_ask_strategy')} 
                  className="border-none bg-transparent focus-visible:ring-0 text-[15px] font-medium h-12 px-4" 
                />
                <div className="flex items-center gap-2 pr-1">
                  <Button type="button" variant="ghost" size="icon" onClick={handleVoiceInput} className="size-11 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/5 shrink-0 transition-all active:scale-90"><Mic className="size-5" /></Button>
                  <Button type="submit" size="icon" disabled={loading || !input.trim()} className="size-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 shadow-lg shadow-primary/20 transition-all active:scale-90"><Send className="size-5" /></Button>
                </div>
              </form>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}
