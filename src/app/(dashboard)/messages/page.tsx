"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Send, Phone, Video, MoreVertical, Trash2, MessageSquare } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const INITIAL_CHATS = [
  { id: 1, name: "Eco Packaging Co", avatar: "https://picsum.photos/seed/eco/100", lastMsg: "The shipment was sent this morning.", time: "10:30 AM", unread: 2, status: "online" },
  { id: 2, name: "FastTrack Logistics", avatar: "https://picsum.photos/seed/log/100", lastMsg: "We need the updated PO.", time: "Yesterday", unread: 0, status: "offline" },
  { id: 3, name: "Skyline Ventures", avatar: "https://picsum.photos/seed/invest/100", lastMsg: "Sync next week?", time: "2 days ago", unread: 0, status: "online" },
];

export default function MessagesPage() {
  const { t } = useLanguage();
  const [chats, setChats] = React.useState(INITIAL_CHATS);
  const [selectedChat, setSelectedChat] = React.useState<any>(INITIAL_CHATS[0]);

  const handleClearAll = () => {
    setChats([]);
    setSelectedChat(null);
  };

  const deleteChat = (id: number) => {
    const updated = chats.filter(c => c.id !== id);
    setChats(updated);
    if (selectedChat?.id === id) {
      setSelectedChat(updated[0] || null);
    }
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-12rem)] flex overflow-hidden bg-card rounded-3xl border border-border shadow-xl relative text-foreground">
        {/* Chat List Sidebar */}
        <div className="w-full md:w-80 lg:w-96 border-r border-border flex flex-col bg-muted/5">
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black">{t('global_pulse')}</h2>
              {chats.length > 0 && (
                <button 
                  onClick={handleClearAll}
                  className="text-[10px] font-black uppercase text-rose-500 hover:text-rose-600 transition-colors"
                >
                  Hapus Semua
                </button>
              )}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input placeholder={t('search_chats')} className="pl-10 h-11 bg-background border-border rounded-xl font-medium" />
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
                  {/* Swipe Background Action (Revealed on Swipe) */}
                  <div className="absolute inset-y-0 right-0 w-20 flex items-center justify-center bg-rose-500 rounded-2xl">
                    <button 
                      onClick={() => deleteChat(chat.id)}
                      className="w-full h-full flex flex-col items-center justify-center text-white active:scale-90 transition-transform"
                    >
                      <Trash2 className="size-5" />
                      <span className="text-[8px] font-black uppercase mt-1">Hapus</span>
                    </button>
                  </div>

                  {/* Swipeable Foreground */}
                  <motion.div
                    drag="x"
                    dragConstraints={{ left: -80, right: 0 }}
                    dragElastic={0.05}
                    dragDirectionLock
                    onDragStart={() => {}} // placeholder to ensure interaction
                    style={{ touchAction: 'pan-y' }}
                    onClick={() => setSelectedChat(chat)}
                    className={cn(
                      "relative z-10 flex items-center gap-4 p-4 rounded-2xl cursor-pointer bg-card border border-transparent transition-colors",
                      selectedChat?.id === chat.id 
                        ? 'bg-background shadow-md border-border' 
                        : 'hover:bg-muted/50'
                    )}
                  >
                    <div className="relative">
                      <Avatar className="size-12 border border-border">
                        <AvatarImage src={chat.avatar} className="object-cover" />
                        <AvatarFallback>{chat.name[0]}</AvatarFallback>
                      </Avatar>
                      {chat.status === 'online' && <div className="absolute bottom-0 right-0 size-3 bg-emerald-500 rounded-full border-2 border-card" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className="font-bold truncate">{chat.name}</h4>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase">{chat.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground font-medium truncate">{chat.lastMsg}</p>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {chats.length === 0 && (
              <div className="py-12 text-center space-y-2 opacity-50">
                <p className="font-bold text-sm">Tidak ada pesan</p>
                <p className="text-[10px] uppercase tracking-widest">Mulai obrolan baru di jaringan</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Window Container */}
        {selectedChat ? (
          <div className="flex-1 hidden md:flex flex-col animate-in fade-in duration-300">
            <header className="h-20 border-b border-border px-8 flex items-center justify-between bg-background/50">
              <div className="flex items-center gap-4">
                <Avatar className="size-10 border border-border">
                  <AvatarImage src={selectedChat.avatar} className="object-cover" />
                  <AvatarFallback>{selectedChat.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold">{selectedChat.name}</h3>
                  <div className="flex items-center gap-1.5">
                    <div className={cn("size-1.5 rounded-full", selectedChat.status === 'online' ? 'bg-emerald-500' : 'bg-muted-foreground')} />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{selectedChat.status}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Button variant="ghost" size="icon" className="rounded-full"><Phone className="size-5" /></Button>
                <Button variant="ghost" size="icon" className="rounded-full"><Video className="size-5" /></Button>
                <Button variant="ghost" size="icon" className="rounded-full"><MoreVertical className="size-5" /></Button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-muted/5 no-scrollbar">
              <div className="flex flex-col gap-1 max-w-[70%]">
                <div className="bg-muted rounded-2xl rounded-tl-none p-4 text-sm font-medium shadow-sm border border-border">
                  Hi! We're reviewing your request for the eco-packaging bulk order.
                </div>
              </div>
              <div className="flex flex-col gap-1 max-w-[70%] ml-auto items-end">
                <div className="bg-accent text-accent-foreground rounded-2xl rounded-tr-none p-4 text-sm font-medium shadow-lg">
                  Great. Let me know when it's ready for dispatch.
                </div>
              </div>
            </div>

            <footer className="p-6 border-t border-border bg-background/50">
              <div className="flex items-center gap-4 bg-muted/50 p-2 rounded-2xl border border-border">
                <Input placeholder={t('type_message')} className="border-none bg-transparent h-10 focus-visible:ring-0" />
                <Button className="size-10 rounded-xl bg-accent text-accent-foreground p-0"><Send className="size-5" /></Button>
              </div>
            </footer>
          </div>
        ) : (
          <div className="flex-1 hidden md:flex flex-col items-center justify-center bg-muted/5 opacity-30 select-none">
             <MessageSquare className="size-20 mb-4" />
             <p className="font-black uppercase tracking-[0.2em] text-xs">Pilih Obrolan</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}