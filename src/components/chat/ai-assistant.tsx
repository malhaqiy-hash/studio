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
    <div className="fixed bottom-24 right-4 z-50 flex flex-col items-end gap-4 animate-in slide-in-from-bottom-5">
      <Card className="w-80 md:w-96 h-[500px] shadow-2xl rounded-3xl border-slate-200 flex flex-col overflow-hidden">
        <CardHeader className="bg-slate-900 text-white p-4 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-accent flex items-center justify-center">
              <User className="size-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-sm font-black">OnTapp Assistant</CardTitle>
              <div className="flex items-center gap-1.5">
                <div className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-400 uppercase">{t('ai_active')}</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
            <X className="size-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0 bg-slate-50/50">
          <ScrollArea className="h-full p-4">
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                  <Avatar className="size-8 border shrink-0">
                    <AvatarFallback className={cn("text-[10px] font-bold", msg.role === 'user' ? "bg-slate-100" : "bg-indigo-50 text-accent")}>
                      {msg.role === 'user' ? 'U' : 'AI'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1 max-w-[85%]">
                    <div className={cn("p-3 rounded-2xl text-xs font-medium shadow-sm", msg.role === 'user' ? "bg-accent text-white rounded-tr-none" : "bg-white text-slate-700 border rounded-tl-none")}>
                      {msg.showTranslated ? msg.translatedContent : msg.content}
                    </div>
                    <button 
                      onClick={() => handleTranslateMessage(i)} 
                      disabled={msg.isTranslating} 
                      className={cn("flex items-center gap-1 transition-colors", msg.showTranslated ? "text-accent" : "text-slate-400 hover:text-accent")}
                      title={msg.showTranslated ? t('ai_original') : t('ai_translating')}
                    >
                      {msg.isTranslating ? <RefreshCw className="size-3 animate-spin" /> : <Globe className="size-3" />}
                    </button>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <Avatar className="size-8 border">
                    <AvatarFallback className="bg-indigo-50 text-accent">
                      <Bot className="size-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-white border p-3 rounded-2xl flex gap-1">
                    <div className="size-1 bg-slate-300 rounded-full animate-bounce" />
                    <div className="size-1 bg-slate-300 rounded-full animate-bounce delay-100" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="p-4 bg-white border-t">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
            className="flex w-full gap-2 bg-slate-50 p-1 rounded-2xl border items-center"
          >
            <Input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder={t('ai_ask_strategy')} 
              className="border-none bg-transparent focus-visible:ring-0 text-xs" 
            />
            <div className="flex items-center gap-1.5 pr-1">
              <Button 
                type="button" 
                variant="ghost"
                size="icon" 
                onClick={handleVoiceInput}
                className="size-8 rounded-xl text-muted-foreground hover:text-accent hover:bg-accent/10 shrink-0"
              >
                <Mic className="size-4" />
              </Button>
              <Button 
                type="submit" 
                size="icon" 
                disabled={loading || !input.trim()} 
                className="size-8 rounded-xl bg-slate-900 text-white shrink-0"
              >
                <Send className="size-4" />
              </Button>
            </div>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}