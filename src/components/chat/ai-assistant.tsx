"use client";

import * as React from 'react';
import { X, Send, Sparkles, Bot, User, Globe, RefreshCw, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

export function AIAssistant() {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);

  React.useEffect(() => {
    setMessages([{ role: 'model', content: t('ai_greet') }]);
  }, [language, t]);

  React.useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-ai-assistant', handleOpen);
    return () => window.removeEventListener('open-ai-assistant', handleOpen);
  }, []);

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
      toast({ 
        variant: "destructive", 
        title: "Browser Tidak Mendukung", 
        description: "Gunakan Chrome atau Safari untuk fitur Voice Search." 
      });
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = language === 'id' ? 'id-ID' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      toast({ title: "Asisten Mendengarkan...", description: "Silakan sampaikan pesan Anda." });
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      toast({ title: "Pesan Diterima", description: `"${transcript}"` });
    };

    recognition.onerror = () => {
      toast({ variant: "destructive", title: "Gagal Mendengar Suara" });
    };

    recognition.start();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-4 z-[200] flex flex-col items-end gap-4 animate-in slide-in-from-bottom-5 duration-300">
      <Card className="w-[320px] md:w-[400px] h-[550px] shadow-2xl rounded-[2.5rem] border-border flex flex-col overflow-hidden bg-card">
        <CardHeader className="bg-slate-900 text-white p-6 flex flex-row items-center justify-between border-none">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
              <Sparkles className="size-5 text-white fill-white" />
            </div>
            <div className="flex flex-col">
              <CardTitle className="text-base font-black tracking-tight leading-none">OnTapp Intel</CardTitle>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{t('ai_active')}</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white hover:bg-white/10 rounded-xl active:scale-90">
            <X className="size-5" />
          </Button>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-hidden p-0 bg-muted/5">
          <ScrollArea className="h-full px-6 py-4">
            <div className="space-y-6">
              {messages.map((msg, i) => (
                <div key={i} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                  <Avatar className="size-8 border shadow-sm shrink-0">
                    <AvatarFallback className={cn("text-[9px] font-black uppercase tracking-tighter", msg.role === 'user' ? "bg-slate-100" : "bg-accent/10 text-accent")}>
                      {msg.role === 'user' ? 'ME' : 'AI'}
                    </AvatarFallback>
                  </Avatar>
                  <div className={cn("flex flex-col gap-1.5", msg.role === 'user' ? "items-end" : "items-start", "max-w-[85%]")}>
                    <div className={cn(
                      "p-4 rounded-2xl text-xs font-medium shadow-sm leading-relaxed", 
                      msg.role === 'user' 
                        ? "bg-accent text-white rounded-tr-none" 
                        : "bg-white text-slate-700 border border-border/50 rounded-tl-none"
                    )}>
                      {msg.showTranslated ? msg.translatedContent : msg.content}
                    </div>
                    <button 
                      onClick={() => handleTranslateMessage(i)} 
                      disabled={msg.isTranslating} 
                      className={cn(
                        "transition-all active:scale-75 flex items-center p-1 rounded-full bg-muted/20", 
                        msg.showTranslated ? "text-accent" : "text-muted-foreground hover:text-accent"
                      )}
                    >
                      {msg.isTranslating ? <RefreshCw className="size-3.5 animate-spin" /> : <Globe className="size-3.5" />}
                    </button>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <Avatar className="size-8 border bg-accent/5">
                    <AvatarFallback className="text-accent"><Bot className="size-4" /></AvatarFallback>
                  </Avatar>
                  <div className="bg-white border border-border/50 p-4 rounded-2xl rounded-tl-none flex gap-1.5 items-center">
                    <div className="size-1 bg-accent/30 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="size-1 bg-accent/30 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="size-1 bg-accent/30 rounded-full animate-bounce" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="p-6 bg-white border-t border-border/50">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
            className="flex w-full gap-2 bg-muted/20 p-1.5 rounded-[1.5rem] border border-border/50 items-center focus-within:border-accent/30 transition-all shadow-inner"
          >
            <Input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder={t('ai_ask_strategy')} 
              className="border-none bg-transparent focus-visible:ring-0 text-[13px] font-medium h-10 px-4" 
            />
            <div className="flex items-center gap-1 pr-1">
              <Button 
                type="button" 
                variant="ghost"
                size="icon" 
                onClick={handleVoiceInput}
                className="size-10 rounded-2xl text-muted-foreground hover:text-accent hover:bg-accent/10 shrink-0 transition-all active:scale-90"
              >
                <Mic className="size-5" />
              </Button>
              <Button 
                type="submit" 
                size="icon" 
                disabled={loading || !input.trim()} 
                className="size-10 rounded-2xl bg-accent hover:bg-accent/90 text-white shrink-0 shadow-lg shadow-accent/10 transition-all active:scale-90"
              >
                <Send className="size-5" />
              </Button>
            </div>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
