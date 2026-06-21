"use client";

import * as React from 'react';
import { Send, Sparkles, Bot, Globe, RefreshCw, Mic } from 'lucide-react';
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
      <Card className="w-[310px] md:w-[380px] h-[500px] shadow-2xl rounded-[2rem] border-border flex flex-col overflow-hidden bg-card">
        <CardHeader className="bg-black text-white p-5 flex flex-row items-center justify-between border-none">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-white text-black flex items-center justify-center shadow-lg">
              <Sparkles className="size-4.5 fill-black" />
            </div>
            <div className="flex flex-col">
              <CardTitle className="text-[15px] font-black tracking-tight leading-none uppercase">Intel Hub</CardTitle>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="size-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">{t('ai_active')}</span>
              </div>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white font-black text-[9px] uppercase tracking-widest px-2 py-1">Tutup</button>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-hidden p-0 bg-muted/5">
          <ScrollArea className="h-full px-5 py-4">
            <div className="space-y-6">
              {messages.map((msg, i) => (
                <div key={i} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                  <Avatar className="size-8 border shadow-sm shrink-0 rounded-lg">
                    <AvatarFallback className={cn("text-[9px] font-black uppercase tracking-tighter rounded-lg", msg.role === 'user' ? "bg-slate-100" : "bg-black text-white")}>
                      {msg.role === 'user' ? 'ME' : 'AI'}
                    </AvatarFallback>
                  </Avatar>
                  <div className={cn("flex flex-col gap-1.5", msg.role === 'user' ? "items-end" : "items-start", "max-w-[85%]")}>
                    <div className={cn(
                      "p-3 rounded-xl text-[14px] font-medium shadow-sm leading-snug", 
                      msg.role === 'user' 
                        ? "bg-black text-white rounded-tr-none" 
                        : "bg-white text-slate-700 border border-border/50 rounded-tl-none"
                    )}>
                      {msg.showTranslated ? msg.translatedContent : msg.content}
                    </div>
                    <button 
                      onClick={() => handleTranslateMessage(i)} 
                      disabled={msg.isTranslating} 
                      className={cn(
                        "transition-all active:scale-75 flex items-center p-1 rounded-full bg-muted/20", 
                        msg.showTranslated ? "text-black" : "text-muted-foreground hover:text-black"
                      )}
                    >
                      {msg.isTranslating ? <RefreshCw className="size-3 animate-spin" /> : <Globe className="size-3" />}
                    </button>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <Avatar className="size-8 border bg-black/5 rounded-lg">
                    <AvatarFallback className="text-black rounded-lg"><Bot className="size-4" /></AvatarFallback>
                  </Avatar>
                  <div className="bg-white border border-border/50 p-4 rounded-xl rounded-tl-none flex gap-1.5 items-center">
                    <div className="size-1 bg-black/30 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="size-1 bg-black/30 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="size-1 bg-black/30 rounded-full animate-bounce" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="p-4 bg-white border-t border-border/50">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
            className="flex w-full gap-2 bg-muted/20 p-1 rounded-2xl border border-border/50 items-center focus-within:border-black/30 transition-all shadow-inner"
          >
            <Input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder={t('ai_ask_strategy')} 
              className="border-none bg-transparent focus-visible:ring-0 text-[13px] font-medium h-9 px-3" 
            />
            <div className="flex items-center gap-1 pr-1">
              <Button 
                type="button" 
                variant="ghost"
                size="icon" 
                onClick={handleVoiceInput}
                className="size-9 rounded-xl text-muted-foreground hover:text-black hover:bg-black/5 shrink-0 transition-all active:scale-90"
              >
                <Mic className="size-4.5" />
              </Button>
              <Button 
                type="submit" 
                size="icon" 
                disabled={loading || !input.trim()} 
                className="size-9 rounded-xl bg-black hover:bg-black/90 text-white shrink-0 shadow-lg transition-all active:scale-90"
              >
                <Send className="size-4.5" />
              </Button>
            </div>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}