
"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  Globe,
  ChevronLeft,
  Clock,
  ChevronRight
} from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useAccount } from "@/context/account-context";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { CardContent } from "@/components/ui/card";
import ConnectionIcon from '@/assets/icons/connection.svg';

const ConnectIcon = ({ className }: { className?: string }) => (
  <div 
    className={cn("bg-current", className)}
    style={{
      maskImage: `url(${ConnectionIcon.src})`,
      WebkitMaskImage: `url(${ConnectionIcon.src})`,
      maskSize: 'contain',
      maskRepeat: 'no-repeat',
      maskPosition: 'center',
      display: 'inline-block'
    }}
  />
);

const INITIAL_CHATS = [
  { id: 1, name: "Eco Packaging Co", avatar: "https://picsum.photos/seed/eco/100", lastMsg: "Pengiriman telah dilakukan pagi ini.", time: "10:30", unread: 2, status: "online", color: "bg-teal-500/10 text-teal-500" },
  { id: 2, name: "FastTrack Logistics", avatar: "https://picsum.photos/seed/log/100", lastMsg: "Kami membutuhkan PO terbaru.", time: "Kemarin", unread: 0, status: "offline", color: "bg-black/5 text-black" },
  { id: 3, name: "Skyline Ventures", avatar: "https://picsum.photos/seed/invest/100", lastMsg: "Ada waktu untuk sync minggu depan?", time: "2 hari lalu", unread: 0, status: "online", color: "bg-indigo-500/10 text-indigo-500" },
];

const DEFAULT_MESSAGES = [
  { id: 'm1', sender: 'other', text: "Halo! Kami sedang meninjau permintaan Anda untuk pesanan kemasan ramah lingkungan.", type: 'text' },
  { id: 'm2', sender: 'me', text: "Bagus. Kabari saya jika sudah siap dikirim.", type: 'text' }
];

function ChatItem({ 
  chat, 
  isMuted, 
  deleteChat, 
  onClick 
}: { 
  chat: any, 
  isMuted: boolean, 
  deleteChat: (id: number) => void, 
  onClick: () => void 
}) {
  const x = useMotionValue(0);
  const trashOpacity = useTransform(x, [-30, 0], [1, 0]);

  return (
    <div className="relative rounded-xl overflow-hidden bg-slate-100 group/card">
      <motion.div 
        style={{ opacity: trashOpacity }}
        className="absolute inset-y-0 right-0 w-14 flex items-center justify-center bg-rose-500 rounded-r-xl"
      >
        <button 
          onClick={(e) => { e.stopPropagation(); deleteChat(chat.id); }}
          className="w-full h-full flex flex-col items-center justify-center text-white active:scale-90 transition-transform"
        >
          <Trash2 className="size-3.5" />
          <span className="text-[7px] font-black uppercase mt-0.5">Hapus</span>
        </button>
      </motion.div>

      <motion.div
        drag="x"
        dragConstraints={{ left: -56, right: 0 }}
        dragElastic={0.02}
        dragDirectionLock
        dragMomentum={false}
        style={{ x, touchAction: 'pan-y' }}
        onClick={onClick}
        className={cn(
          "relative z-10 bg-card border border-border shadow-sm rounded-xl transition-colors hover:bg-slate-50/50 cursor-pointer",
          chat.unread > 0 ? 'border-l-[3px] border-l-black' : ''
        )}
      >
        <CardContent className="p-3 md:p-3.5">
          <div className="flex items-start gap-3">
            <div className="relative shrink-0">
               <Avatar className="size-11 rounded-xl border border-border shadow-inner">
                  <AvatarImage src={chat.avatar} className="object-cover" />
                  <AvatarFallback className="bg-primary/5 text-primary font-black text-xs">{chat.name[0]}</AvatarFallback>
               </Avatar>
               {chat.status === 'online' && (
                 <div className="absolute -bottom-0.5 -right-0.5 size-3 bg-emerald-500 border-2 border-card rounded-full" />
               )}
            </div>
            <div className="flex-1 min-w-0 space-y-0.5">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                     <h3 className="font-black tracking-tight uppercase text-[11px] text-foreground truncate">{chat.name}</h3>
                     {isMuted && <BellOff className="size-2.5 text-muted-foreground/50" />}
                  </div>
                  <span className="text-[7px] text-muted-foreground font-black uppercase flex items-center gap-0.5 whitespace-nowrap"><Clock className="size-2" /> {chat.time}</span>
               </div>
               <p className={cn("text-[10px] font-medium leading-snug line-clamp-1", chat.unread > 0 ? "text-foreground font-bold" : "text-muted-foreground")}>{chat.lastMsg}</p>
               <div className="pt-1.5 flex items-center justify-between">
                  <Badge className={cn("text-[7px] font-black uppercase px-1.5 py-0.5 border-none shadow-none", chat.unread > 0 ? "bg-black text-white" : "bg-muted text-muted-foreground opacity-60")}>
                    {chat.unread > 0 ? `${chat.unread} Baru` : 'Dibaca'}
                  </Badge>
                  <ChevronRight className="size-3 text-muted-foreground/30 group-hover/card:text-black transition-colors" />
               </div>
            </div>
          </div>
        </CardContent>
      </motion.div>
    </div>
  );
}

export default function MessagesPage() {
  const { t } = useLanguage();
  const { activeAccount } = useAccount();
  const { toast } = useToast();
  
  const [chats, setChats] = React.useState<any[]>([]);
  const [selectedChat, setSelectedChat] = React.useState<any>(null);
  const [messagesByChat, setMessagesByChat] = React.useState<Record<number, any[]>>({});
  const [inputText, setInputText] = React.useState("");
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState<Record<number, boolean>>({});
  const [isChatOpen, setIsChatOpen] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const cameraInputRef = React.useRef<HTMLInputElement>(null);
  const docInputRef = React.useRef<HTMLInputElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const getChatsKey = React.useCallback(() => `ontapp_chats_full_${activeAccount.id}`, [activeAccount.id]);
  const getMsgsKey = React.useCallback(() => `ontapp_msgs_full_${activeAccount.id}`, [activeAccount.id]);

  // Handle back button to close chat
  React.useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (isChatOpen) {
        setIsChatOpen(false);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isChatOpen]);

  React.useEffect(() => {
    const savedChats = localStorage.getItem(getChatsKey());
    const savedMsgs = localStorage.getItem(getMsgsKey());
    if (savedChats) { try { setChats(JSON.parse(savedChats)); } catch (e) { setChats(INITIAL_CHATS); } } else { setChats(INITIAL_CHATS); }
    if (savedMsgs) { try { setMessagesByChat(JSON.parse(savedMsgs)); } catch (e) { setMessagesByChat({}); } }
    setIsLoaded(true);
  }, [activeAccount.id, getChatsKey, getMsgsKey]);

  React.useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(getChatsKey(), JSON.stringify(chats));
      localStorage.setItem(getMsgsKey(), JSON.stringify(messagesByChat));
    }
  }, [chats, messagesByChat, isLoaded, getChatsKey, getMsgsKey]);

  React.useEffect(() => {
    if (scrollRef.current) { scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }
  }, [selectedChat, messagesByChat, isChatOpen]);

  const handleChatSelection = (chat: any) => {
    setSelectedChat(chat);
    setIsChatOpen(true);
    window.history.pushState({ chatOpen: true }, '');
  };

  const closeChat = () => {
    if (window.history.state?.chatOpen) {
      window.history.back();
    } else {
      setIsChatOpen(false);
    }
  };

  const addMessage = (chatId: number, msg: any) => {
    setMessagesByChat(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || DEFAULT_MESSAGES), { ...msg, id: `msg-${Date.now()}` }]
    }));
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, lastMsg: msg.text || "Media terkirim", time: "Baru saja" } : c));
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
        addMessage(selectedChat.id, { sender: 'me', text: file.name, media: reader.result as string, type });
        toast({ title: type === 'image' ? "Foto Terkirim" : "Dokumen Terkirim" });
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const deleteChat = (id: number) => {
    setChats(prev => prev.filter(c => c.id !== id));
    if (selectedChat?.id === id) closeChat();
    toast({ title: "Obrolan dihapus" });
  };

  if (!isLoaded) return null;

  return (
    <DashboardLayout>
      <div className="space-y-4 pb-24 relative max-w-xl mx-auto px-1 md:px-0">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-black font-black text-[8px] uppercase tracking-[0.2em]"><MessageSquare className="size-2.5" /> {t('messages')}</div>
            <h1 className="text-base font-black tracking-tight uppercase">{t('global_pulse')}</h1>
            <p className="text-muted-foreground font-medium text-[9px] uppercase tracking-widest">Komunikasi bisnis terenkripsi</p>
          </div>
          <div className="relative w-full md:w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
            <Input placeholder={t('search_chats')} className="pl-9 h-8 bg-card border-border rounded-lg text-[10px] font-bold uppercase tracking-widest" />
          </div>
        </header>

        <div className="space-y-1.5 min-h-[400px]">
          <AnimatePresence initial={false}>
            {chats.map((chat) => (
              <motion.div key={chat.id} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ type: "spring", stiffness: 500, damping: 35 }} className="overflow-hidden">
                <ChatItem chat={chat} isMuted={isMuted[chat.id]} deleteChat={deleteChat} onClick={() => handleChatSelection(chat)} />
              </motion.div>
            ))}
          </AnimatePresence>
          {chats.length === 0 && (
            <div className="py-12 text-center space-y-3 bg-card rounded-2xl border-2 border-dashed border-border/50">
               <div className="size-14 rounded-full bg-muted/20 flex items-center justify-center mx-auto shadow-inner"><MessageSquare className="size-7 text-muted-foreground/30" /></div>
               <div className="space-y-1 px-4"><h3 className="text-[11px] font-black text-slate-900 uppercase">Tidak Ada Percakapan</h3><p className="text-slate-400 max-w-xs mx-auto font-medium text-[8px] uppercase tracking-widest leading-relaxed">Mulai membangun koneksi dengan mencari mitra strategis di jaringan Tapp.</p></div>
            </div>
          )}
        </div>

        <Dialog open={isChatOpen} onOpenChange={(open) => !open && closeChat()}>
          <DialogContent className="w-[95%] h-[85dvh] max-w-lg p-0 border-none rounded-t-3xl sm:rounded-3xl bg-card text-foreground outline-none shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-300 z-[170] [&>button]:hidden">
            {selectedChat && (
              <div className="flex flex-col h-full overflow-hidden">
                <header className="h-12 border-b border-border px-4 flex items-center justify-between bg-card shrink-0">
                  <div className="flex items-center gap-2.5">
                    <button onClick={closeChat} className="size-8 flex items-center justify-center text-muted-foreground hover:text-primary active:scale-90 transition-all"><ChevronLeft className="size-5" /></button>
                    <Avatar className="size-8 border border-border"><AvatarImage src={selectedChat.avatar} className="object-cover" /><AvatarFallback className="text-[9px]">{selectedChat.name[0]}</AvatarFallback></Avatar>
                    <div className="min-w-0"><h3 className="font-black text-[12px] leading-none truncate max-w-[150px] uppercase tracking-tight">{selectedChat.name}</h3><div className="flex items-center gap-1 mt-1"><div className={cn("size-1.5 rounded-full", selectedChat.status === 'online' ? 'bg-emerald-500' : 'bg-muted-foreground')} /><span className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">{selectedChat.status}</span></div></div>
                  </div>
                </header>

                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/5 scroll-smooth">
                  {(messagesByChat[selectedChat.id] || DEFAULT_MESSAGES).map((msg, i) => (
                    <div key={i} className={cn("flex flex-col gap-1 max-w-[85%]", msg.sender === 'me' ? "ml-auto items-end" : "items-start")}>
                      <div className={cn("p-3 text-[11px] font-medium shadow-sm border border-border leading-relaxed rounded-xl", msg.sender === 'me' ? "bg-black text-white rounded-tr-none border-none" : "bg-card text-foreground rounded-tl-none")}>
                        {msg.type === 'text' && msg.text}
                        {msg.type === 'image' && <div className="space-y-1.5"><img src={msg.media} className="rounded-lg max-w-full max-h-60 object-cover" alt="Sent" />{msg.text && <p className="opacity-70 text-[9px] truncate">{msg.text}</p>}</div>}
                        {msg.type === 'doc' && <div className="flex items-center gap-2 bg-black/10 p-2 rounded-lg"><FileText className="size-4" /><span className="truncate max-w-[120px]">{msg.text}</span></div>}
                      </div>
                    </div>
                  ))}
                </div>

                <footer className="p-3 border-t border-border bg-card shrink-0 pb-safe">
                  <form onSubmit={handleSendText} className="flex items-center gap-2 bg-muted/50 p-1 rounded-xl border border-border">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="size-8 flex items-center justify-center text-muted-foreground hover:text-black"><Plus className="size-4" /></button>
                    <Input value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder={t('type_message')} className="border-none bg-transparent h-9 focus-visible:ring-0 text-[13px] flex-1" />
                    <Button type="submit" size="icon" className="size-9 rounded-lg bg-black text-white p-0 active:scale-95 transition-transform"><Send className="size-4" /></Button>
                  </form>
                </footer>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} />
      </div>
    </DashboardLayout>
  );
}
