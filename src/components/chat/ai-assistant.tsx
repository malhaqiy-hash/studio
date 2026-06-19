'use client';

import * as React from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Globe,
  RefreshCw,
  Mic
} from 'lucide-react';
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
  const { language } = useLanguage();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [isListening, setIsListening] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([
    { 
      role: 'model', 
      content: 'Halo! Saya OnTapp assistant Anda. Bagaimana saya bisa membantu mengoptimalkan jaringan bisnis Anda hari ini?' 
    }
  ]);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  // Listen for external open event from layout
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
      console.error('AI Error:', error);
      setMessages((prev) => [
        ...prev, 
        { role: 'model', content: 'Mohon maaf, saya mengalami kendala teknis. Silakan coba lagi sebentar lagi.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoice = () => {
    if (typeof window !== 'undefined' && !('webkitSpeechRecognition' in window) && !('speechRecognition' in window)) {
      toast({
        variant: "destructive",
        title: "Browser Tidak Mendukung",
        description: "Fitur suara tidak tersedia di browser ini."
      });
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).speechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = language === 'id' ? 'id-ID' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleTranslateMessage = async (index: number) => {
    const msg = messages[index];
    if (msg.translatedContent) {
      setMessages(prev => prev.map((m, i) => i === index ? { ...m, showTranslated: !m.showTranslated } : m));
      return;
    }

    setMessages(prev => prev.map((m, i) => i === index ? { ...m, isTranslating: true } : m));

    try {
      const { translatedText } = await translateText({
        text: msg.content,
        targetLanguage: language
      });
      
      setMessages(prev => prev.map((m, i) => i === index ? { 
        ...m, 
        translatedContent: translatedText, 
        showTranslated: true, 
        isTranslating: false 
      } : m));
    } catch (err) {
      console.error("Translation failed", err);
      setMessages(prev => prev.map((m, i) => i === index ? { ...m, isTranslating: false } : m));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-4 z-50 flex flex-col items-end gap-4">
      <Card className="w-80 md:w-96 h-[500px] shadow-2xl rounded-3xl border-slate-200 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-300">
        <CardHeader className="bg-slate-900 text-white p-4 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-accent flex items-center justify-center">
              <Sparkles className="size-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-sm font-black tracking-tight">OnTapp assistant</CardTitle>
              <div className="flex items-center gap-1.5">
                <div className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aktif</span>
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
                  <Avatar className="size-8 border shrink-0">
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
                  <div className="flex flex-col gap-1 max-w-[80%]">
                    <div className={cn(
                      "p-3 rounded-2xl text-sm font-medium shadow-sm",
                      msg.role === 'user' 
                        ? "bg-accent text-white rounded-tr-none" 
                        : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                    )}>
                      {msg.showTranslated ? msg.translatedContent : msg.content}
                    </div>
                    
                    {/* Translation Controls */}
                    <div className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                      <button 
                        onClick={() => handleTranslateMessage(i)}
                        disabled={msg.isTranslating}
                        className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-accent transition-colors disabled:opacity-50"
                      >
                        {msg.isTranslating ? (
                          <RefreshCw className="size-2.5 animate-spin" />
                        ) : (
                          <Globe className="size-2.5" />
                        )}
                        {msg.showTranslated ? "Tampilkan Asli" : (msg.translatedContent ? "Tampilkan Terjemahan" : "Terjemahkan")}
                      </button>
                    </div>
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
              placeholder="Tanya strategi..." 
              className="border-none bg-transparent focus-visible:ring-0 shadow-none font-medium text-sm"
            />
            <Button 
              type="button"
              variant="ghost"
              size="icon"
              onClick={toggleVoice}
              className={cn(
                "rounded-xl shrink-0 transition-all",
                isListening ? "text-rose-500 animate-pulse bg-rose-50" : "text-slate-400 hover:text-accent hover:bg-slate-100"
              )}
            >
              <Mic className="size-4" />
            </Button>
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
    </div>
  );
}