
"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Send, Phone, Video, MoreVertical, Trash2, MessageSquare } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useAccount } from "@/context/account-context";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const INITIAL_CHATS = [
  { id: 1, name: "Eco Packaging Co", avatar: "https://picsum.photos/seed/eco/100", lastMsg: "The shipment was sent this morning.", time: "10:30 AM", unread: 2, status: "online" },
  { id: 2, name: "FastTrack Logistics", avatar: "https://picsum.photos/seed/log/100", lastMsg: "We need the updated PO.", time: "Yesterday", unread: 0, status: "offline" },
  { id: 3, name: "Skyline Ventures", avatar: "https://picsum.photos/seed/invest/100", lastMsg: "Sync next week?", time: "2 days ago", unread: 0, status: "online" },
];

export default function MessagesPage() {
  const { t } = useLanguage();
  const { activeAccount } = useAccount();
  const [chats, setChats] = React.useState<any[]>([]);
  const [selectedChat, setSelectedChat] = React.useState<any>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  const getStorageKey = React.useCallback(() => `ontapp_chats_data_${activeAccount.id}`, [activeAccount.id]);

  // Load from localStorage on mount and account change
  React.useEffect(() => {
    const saved = localStorage.getItem(getStorageKey());
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setChats(parsed);
        if (parsed.length > 0) setSelectedChat(parsed[0]);
        else setSelectedChat(null);
      } catch (e) {
        setChats(INITIAL_CHATS);
        setSelectedChat(INITIAL_CHATS[0]);
      }
    } else {
      setChats(INITIAL_CHATS);
      setSelectedChat(INITIAL_CHATS[0]);
    }
    setIsLoaded(true);
  }, [activeAccount.id, getStorageKey]);

  // Save to localStorage on changes
  React.useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(getStorageKey(), JSON.stringify(chats));
    }
  }, [chats, isLoaded, getStorageKey]);

  const handleClearAll = () => {
    setChats([]);
    setSelectedChat(null);
  };

  const deleteChat = (id: number) => {
    setChats(prev => {
      const updated = prev.filter(c => c.id !== id);
      if (selectedChat?.id === id) {
        setSelectedChat(updated[0] || null);
      }
      return updated;
    });
  };

  if (!isLoaded) return null;

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-10rem)] flex overflow-hidden bg-card rounded-2xl border border-border shadow-xl relative text-foreground max-w-5xl mx-auto">
        {/* Chat List Sidebar */}
        <div className="w-full md:w-72 lg:w-80 border-r border-border flex flex-col bg-muted/5">
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[12px] font-black tracking-tight uppercase">{t('global_pulse')}</h2>
              {chats.length > 0 && (
                <button 
                  onClick={handleClearAll}
                  className="text-[9px] font-black uppercase text-rose-500 hover:text-rose-600 transition-colors"
                >
                  Hapus Semua
                </button>
              )}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
              <Input placeholder={t('search_chats')} className="pl-9 h-8 bg-background border-border rounded-lg text-[10px] font-medium" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto px-2 pb-6 space-y-1 no-scrollbar overflow-x-hidden">
            <AnimatePresence initial={false}>
              {chats.map((chat) => (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0, x: -100 }}
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  className="relative group overflow-hidden"
                >
                  <div className="absolute inset-y-0 right-0 w-14 flex items-center justify-center bg-rose-500 rounded-xl">
                    <button 
                      onClick={() => deleteChat(chat.id)}
                      className="w-full h-full flex flex-col items-center justify-center text-white active:scale-90 transition-transform"
                    >
                      <Trash2 className="size-3.5" />
                      <span className="text-[7px] font-black uppercase mt-0.5">Hapus</span>
                    </button>
                  </div>

                  <motion.div
                    drag="x"
                    dragConstraints={{ left: -56, right: 0 }}
                    dragElastic={0.05}
                    dragDirectionLock
                    onDragStart={() => {}} 
                    style={{ touchAction: 'pan-y' }}
                    onClick={() => setSelectedChat(chat)}
                    className={cn(
                      "relative z-10 flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer bg-card border border-transparent transition-colors",
                      selectedChat?.id === chat.id 
                        ? 'bg-background shadow-sm border-border' 
                        : 'hover:bg-muted/50'
                    )}
                  >
                    <div className="relative">
                      <Avatar className="size-9 border border-border">
                        <AvatarImage src={chat.avatar} className="object-cover" />
                        <AvatarFallback className="text-[9px]">{chat.name[0]}</AvatarFallback>
                      </Avatar>
                      {chat.status === 'online' && <div className="absolute bottom-0 right-0 size-2 bg-emerald-500 rounded-full border-2 border-card" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h4 className="font-bold text-[11px] truncate">{chat.name}</h4>
                        <span className="text-[7px] text-muted-foreground font-black uppercase">{chat.time}</span>
                      </div>
                      <p className="text-[9px] text-muted-foreground font-medium truncate">{chat.lastMsg}</p>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {chats.length === 0 && (
              <div className="py-12 text-center space-y-2 opacity-50">
                <p className="font-bold text-[9px] uppercase tracking-widest text-muted-foreground">Tidak ada pesan</p>
              </div>
            )}
          </div>
        </div>

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
              <div className="flex items-center gap-0.5 text-muted-foreground">
                <Button variant="ghost" size="icon" className="size-7 rounded-lg"><Phone className="size-3.5" /></Button>
                <Button variant="ghost" size="icon" className="size-7 rounded-lg"><Video className="size-3.5" /></Button>
                <Button variant="ghost" size="icon" className="size-7 rounded-lg"><MoreVertical className="size-3.5" /></Button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-muted/5 no-scrollbar">
              <div className="flex flex-col gap-1 max-w-[75%]">
                <div className="bg-muted rounded-xl rounded-tl-none p-2.5 text-[11px] font-medium shadow-sm border border-border leading-relaxed">
                  Hi! We're reviewing your request for the eco-packaging bulk order.
                </div>
              </div>
              <div className="flex flex-col gap-1 max-w-[75%] ml-auto items-end">
                <div className="bg-accent text-accent-foreground rounded-xl rounded-tr-none p-2.5 text-[11px] font-medium shadow-lg leading-relaxed">
                  Great. Let me know when it's ready for dispatch.
                </div>
              </div>
            </div>

            <footer className="p-3 border-t border-border bg-background/50">
              <div className="flex items-center gap-2.5 bg-muted/50 p-1 rounded-xl border border-border">
                <Input placeholder={t('type_message')} className="border-none bg-transparent h-8 focus-visible:ring-0 text-[11px]" />
                <Button className="size-8 rounded-lg bg-accent text-accent-foreground p-0 active:scale-95 transition-transform"><Send className="size-3.5" /></Button>
              </div>
            </footer>
          </div>
        ) : (
          <div className="flex-1 hidden md:flex flex-col items-center justify-center bg-muted/5 opacity-30 select-none">
             <MessageSquare className="size-10 mb-2" />
             <p className="font-black uppercase tracking-[0.2em] text-[8px]">Pilih Obrolan</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
