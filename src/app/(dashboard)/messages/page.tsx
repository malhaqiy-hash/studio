
"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Send, 
  MoreVertical, 
  Trash2, 
  MessageSquare,
  BellOff,
  Eraser,
  Check,
  Plus,
  Image as ImageIcon,
  Camera,
  MapPin,
  User,
  FileText,
  Link as LinkIcon,
  X,
  Smartphone,
  Globe
} from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useAccount } from "@/context/account-context";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const INITIAL_CHATS = [
  { id: 1, name: "Eco Packaging Co", avatar: "https://picsum.photos/seed/eco/100", lastMsg: "The shipment was sent this morning.", time: "10:30 AM", unread: 2, status: "online" },
  { id: 2, name: "FastTrack Logistics", avatar: "https://picsum.photos/seed/log/100", lastMsg: "We need the updated PO.", time: "Yesterday", unread: 0, status: "offline" },
  { id: 3, name: "Skyline Ventures", avatar: "https://picsum.photos/seed/invest/100", lastMsg: "Sync next week?", time: "2 days ago", unread: 0, status: "online" },
];

const DEFAULT_MESSAGES = [
  { id: 'm1', sender: 'other', text: "Hi! We're reviewing your request for the eco-packaging bulk order.", type: 'text' },
  { id: 'm2', sender: 'me', text: "Great. Let me know when it's ready for dispatch.", type: 'text' }
];

export default function MessagesPage() {
  const { t, language } = useLanguage();
  const { activeAccount } = useAccount();
  const { toast } = useToast();
  
  const [chats, setChats] = React.useState<any[]>([]);
  const [selectedChat, setSelectedChat] = React.useState<any>(null);
  const [messagesByChat, setMessagesByChat] = React.useState<Record<number, any[]>>({});
  const [inputText, setInputText] = React.useState("");
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState<Record<number, boolean>>({});

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const cameraInputRef = React.useRef<HTMLInputElement>(null);
  const docInputRef = React.useRef<HTMLInputElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const getChatsKey = React.useCallback(() => `ontapp_chats_v3_${activeAccount.id}`, [activeAccount.id]);
  const getMsgsKey = React.useCallback(() => `ontapp_msgs_v3_${activeAccount.id}`, [activeAccount.id]);

  // Load Data
  React.useEffect(() => {
    const savedChats = localStorage.getItem(getChatsKey());
    const savedMsgs = localStorage.getItem(getMsgsKey());
    
    if (savedChats) {
      try {
        const parsed = JSON.parse(savedChats);
        setChats(parsed);
        if (parsed.length > 0) setSelectedChat(parsed[0]);
      } catch (e) { setChats(INITIAL_CHATS); setSelectedChat(INITIAL_CHATS[0]); }
    } else {
      setChats(INITIAL_CHATS);
      setSelectedChat(INITIAL_CHATS[0]);
    }

    if (savedMsgs) {
      try { setMessagesByChat(JSON.parse(savedMsgs)); } catch (e) { setMessagesByChat({}); }
    }
    
    setIsLoaded(true);
  }, [activeAccount.id, getChatsKey, getMsgsKey]);

  // Save Data
  React.useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(getChatsKey(), JSON.stringify(chats));
      localStorage.setItem(getMsgsKey(), JSON.stringify(messagesByChat));
    }
  }, [chats, messagesByChat, isLoaded, getChatsKey, getMsgsKey]);

  // Scroll to bottom
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedChat, messagesByChat]);

  const addMessage = (chatId: number, msg: any) => {
    setMessagesByChat(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || DEFAULT_MESSAGES), { ...msg, id: `msg-${Date.now()}` }]
    }));
    
    // Update last msg in chat list
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, lastMsg: msg.text || "Media sent", time: "Just now" } : c));
  };

  const handleSendText = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || !selectedChat) return;
    addMessage(selectedChat.id, { sender: 'me', text: inputText, type: 'text' });
    setInputText("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'doc') => {
    const file = e.target.files?.[0];
    if (file && selectedChat) {
      const reader = new FileReader();
      reader.onloadend = () => {
        addMessage(selectedChat.id, { 
          sender: 'me', 
          text: file.name, 
          media: reader.result as string, 
          type 
        });
        toast({ title: type === 'image' ? "Foto Terkirim" : "Dokumen Terkirim" });
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleAction = (action: string) => {
    if (!selectedChat) return;
    
    switch(action) {
      case 'location':
        addMessage(selectedChat.id, { sender: 'me', text: "Shared Location", type: 'location', detail: "Jakarta, Indonesia" });
        toast({ title: "Lokasi dibagikan" });
        break;
      case 'contact':
        addMessage(selectedChat.id, { sender: 'me', text: activeAccount.name, type: 'contact', detail: activeAccount.type });
        toast({ title: "Kontak dibagikan" });
        break;
      case 'link':
        addMessage(selectedChat.id, { sender: 'me', text: "https://tapp.network/profile/" + activeAccount.id, type: 'link' });
        toast({ title: "Link dibagikan" });
        break;
    }
  };

  const deleteChat = (id: number) => {
    setChats(prev => {
      const updated = prev.filter(c => c.id !== id);
      if (selectedChat?.id === id) setSelectedChat(updated[0] || null);
      return updated;
    });
    toast({ title: "Obrolan dihapus" });
  };

  const handleClearHistory = () => {
    if (!selectedChat) return;
    setMessagesByChat(prev => ({ ...prev, [selectedChat.id]: [] }));
    toast({ title: "Riwayat dibersihkan" });
  };

  const toggleMute = (id: number) => {
    setIsMuted(prev => ({ ...prev, [id]: !prev[id] }));
    toast({ title: !isMuted[id] ? "Obrolan Disenyapkan" : "Suara Diaktifkan" });
  };

  if (!isLoaded) return null;

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-10rem)] flex overflow-hidden bg-card rounded-2xl border border-border shadow-xl relative text-foreground max-w-5xl mx-auto">
        
        {/* Chat List */}
        <div className="w-full md:w-72 lg:w-80 border-r border-border flex flex-col bg-muted/5">
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[12px] font-black tracking-tight uppercase">{t('global_pulse')}</h2>
              {chats.length > 0 && (
                <button onClick={() => { setChats([]); setSelectedChat(null); }} className="text-[9px] font-black uppercase text-rose-500 hover:text-rose-600">Hapus Semua</button>
              )}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
              <Input placeholder={t('search_chats')} className="pl-9 h-8 bg-background border-border rounded-lg text-[10px] font-medium" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto px-2 pb-6 space-y-1 no-scrollbar overflow-x-hidden">
            {chats.map((chat) => (
              <motion.div
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={cn(
                  "relative flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer bg-card border border-transparent transition-all",
                  selectedChat?.id === chat.id ? 'bg-background shadow-sm border-border' : 'hover:bg-muted/50'
                )}
              >
                <div className="relative">
                  <Avatar className="size-9 border border-border">
                    <AvatarImage src={chat.avatar} className="object-cover" />
                    <AvatarFallback className="text-[9px]">{chat.name[0]}</AvatarFallback>
                  </Avatar>
                  {chat.status === 'online' && <div className="absolute bottom-0 right-0 size-2 bg-emerald-500 rounded-full border-2 border-card" />}
                  {isMuted[chat.id] && <div className="absolute -top-1 -right-1 size-3.5 bg-slate-900 text-white rounded-full flex items-center justify-center"><BellOff className="size-2" /></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="font-bold text-[11px] truncate">{chat.name}</h4>
                    <span className="text-[7px] text-muted-foreground font-black uppercase">{chat.time}</span>
                  </div>
                  <p className="text-[9px] text-muted-foreground font-medium truncate">{chat.lastMsg}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        {selectedChat ? (
          <div className="flex-1 hidden md:flex flex-col animate-in fade-in duration-300">
            <header className="h-14 border-b border-border px-5 flex items-center justify-between bg-background/50">
              <div className="flex items-center gap-2.5">
                <Avatar className="size-8 border border-border">
                  <AvatarImage src={selectedChat.avatar} className="object-cover" />
                  <AvatarFallback className="text-[9px]">{selectedChat.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-[12px] leading-none">{selectedChat.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <div className={cn("size-1.5 rounded-full", selectedChat.status === 'online' ? 'bg-emerald-500' : 'bg-muted-foreground')} />
                    <span className="text-[8px] font-bold text-muted-foreground uppercase">{selectedChat.status}</span>
                  </div>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="size-8 rounded-lg text-muted-foreground hover:text-primary flex items-center justify-center outline-none"><MoreVertical className="size-4" /></button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-xl p-1 shadow-2xl border-border bg-card">
                  <DropdownMenuItem onClick={() => toggleMute(selectedChat.id)} className="gap-2.5 px-3 py-2.5 rounded-lg font-bold text-[10px] cursor-pointer"><BellOff className="size-3.5" /> {isMuted[selectedChat.id] ? "Aktifkan Suara" : "Senyapkan"}</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleClearHistory} className="gap-2.5 px-3 py-2.5 rounded-lg font-bold text-[10px] cursor-pointer"><Eraser className="size-3.5" /> Bersihkan Riwayat</DropdownMenuItem>
                  <div className="h-px bg-border my-1" />
                  <DropdownMenuItem onClick={() => deleteChat(selectedChat.id)} className="gap-2.5 px-3 py-2.5 rounded-lg font-bold text-rose-500 hover:bg-rose-50 text-[10px] cursor-pointer"><Trash2 className="size-3.5" /> Hapus Obrolan</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-muted/5 no-scrollbar">
              {(messagesByChat[selectedChat.id] || DEFAULT_MESSAGES).map((msg, i) => (
                <div key={i} className={cn("flex flex-col gap-1 max-w-[75%]", msg.sender === 'me' ? "ml-auto items-end" : "items-start")}>
                  <div className={cn(
                    "p-2.5 text-[11px] font-medium shadow-sm border border-border leading-relaxed rounded-xl",
                    msg.sender === 'me' ? "bg-accent text-accent-foreground rounded-tr-none" : "bg-card text-foreground rounded-tl-none"
                  )}>
                    {msg.type === 'text' && msg.text}
                    {msg.type === 'image' && (
                      <div className="space-y-1.5">
                        <img src={msg.media} className="rounded-lg max-w-full max-h-48 object-cover" />
                        {msg.text && <p className="opacity-70 text-[9px]">{msg.text}</p>}
                      </div>
                    )}
                    {msg.type === 'doc' && (
                      <div className="flex items-center gap-2 bg-black/10 p-2 rounded-lg">
                        <FileText className="size-4" />
                        <span className="truncate max-w-[120px]">{msg.text}</span>
                      </div>
                    )}
                    {msg.type === 'location' && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2"><MapPin className="size-4 text-rose-500" /> <span className="font-bold">{msg.detail}</span></div>
                        <div className="w-full aspect-video bg-slate-100 rounded-lg flex items-center justify-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">Map Preview</div>
                      </div>
                    )}
                    {msg.type === 'contact' && (
                      <div className="flex items-center gap-3 bg-black/5 p-2 rounded-lg border border-black/10">
                        <div className="size-8 rounded-lg bg-white flex items-center justify-center shadow-sm"><User className="size-4 text-accent" /></div>
                        <div><p className="font-bold leading-none">{msg.text}</p><p className="text-[9px] opacity-60 uppercase font-black tracking-widest mt-1">{msg.detail}</p></div>
                      </div>
                    )}
                    {msg.type === 'link' && (
                      <a href={msg.text} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-indigo-200 underline decoration-indigo-200/50 underline-offset-2">
                         <LinkIcon className="size-3" /> {msg.text}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <footer className="p-3 border-t border-border bg-background/50">
              <form onSubmit={handleSendText} className="flex items-center gap-2 bg-muted/50 p-1 rounded-xl border border-border">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8 rounded-lg text-muted-foreground hover:text-primary transition-all">
                      <Plus className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" side="top" className="w-48 rounded-xl p-1 shadow-2xl border-border bg-card animate-in slide-in-from-bottom-2">
                    <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="gap-2.5 px-3 py-2.5 rounded-lg font-bold text-[10px] cursor-pointer"><ImageIcon className="size-3.5 text-blue-500" /> Foto</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => cameraInputRef.current?.click()} className="gap-2.5 px-3 py-2.5 rounded-lg font-bold text-[10px] cursor-pointer"><Camera className="size-3.5 text-rose-500" /> Kamera</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAction('location')} className="gap-2.5 px-3 py-2.5 rounded-lg font-bold text-[10px] cursor-pointer"><MapPin className="size-3.5 text-emerald-500" /> Lokasi</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAction('contact')} className="gap-2.5 px-3 py-2.5 rounded-lg font-bold text-[10px] cursor-pointer"><User className="size-3.5 text-amber-500" /> Kontak</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => docInputRef.current?.click()} className="gap-2.5 px-3 py-2.5 rounded-lg font-bold text-[10px] cursor-pointer"><FileText className="size-3.5 text-indigo-500" /> Dokumen</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAction('link')} className="gap-2.5 px-3 py-2.5 rounded-lg font-bold text-[10px] cursor-pointer"><LinkIcon className="size-3.5 text-slate-500" /> Link</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Input 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={t('type_message')} 
                  className="border-none bg-transparent h-8 focus-visible:ring-0 text-[11px] flex-1" 
                />
                <Button type="submit" className="size-8 rounded-lg bg-accent text-accent-foreground p-0 active:scale-95 transition-transform"><Send className="size-3.5" /></Button>
              </form>
            </footer>
          </div>
        ) : (
          <div className="flex-1 hidden md:flex flex-col items-center justify-center bg-muted/5 opacity-30 select-none">
             <MessageSquare className="size-10 mb-2" />
             <p className="font-black uppercase tracking-[0.2em] text-[8px]">Pilih Obrolan</p>
          </div>
        )}

        {/* Hidden Inputs */}
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} />
        <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={(e) => handleFileUpload(e, 'image')} />
        <input type="file" ref={docInputRef} className="hidden" onChange={(e) => handleFileUpload(e, 'doc')} />
      </div>
    </DashboardLayout>
  );
}
