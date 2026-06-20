
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Send, Phone, Video, Info, MoreVertical, Globe, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/language-context";

const CHATS = [
  { id: 1, name: "Eco Packaging Co", avatar: "https://picsum.photos/seed/eco/100", lastMsg: "The shipment was sent this morning.", time: "10:30 AM", unread: 2, status: "online" },
  { id: 2, name: "FastTrack Logistics", avatar: "https://picsum.photos/seed/log/100", lastMsg: "We need the updated PO for the Rotterdam route.", time: "Yesterday", unread: 0, status: "offline" },
  { id: 3, name: "Skyline Ventures", avatar: "https://picsum.photos/seed/invest/100", lastMsg: "Looking forward to our sync next week.", time: "2 days ago", unread: 0, status: "online" },
  { id: 4, name: "Alpha Tech Hardware", avatar: "https://picsum.photos/seed/tech/100", lastMsg: "Price list for Q4 is attached below.", time: "3 days ago", unread: 0, status: "away" },
];

export default function MessagesPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [selectedChat, setSelectedChat] = React.useState(CHATS[0]);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'online': return t('online');
      case 'offline': return t('offline');
      case 'away': return t('away');
      default: return status;
    }
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-12rem)] flex overflow-hidden bg-card rounded-3xl border border-border shadow-xl relative">
        <button 
          onClick={() => router.back()}
          className="absolute top-4 right-4 z-50 p-2 bg-muted hover:bg-accent/10 text-muted-foreground hover:text-accent rounded-full transition-all active:scale-90 md:hidden"
        >
          <X className="size-5" />
        </button>

        <div className="w-full md:w-80 lg:w-96 border-r border-border flex flex-col bg-muted/10">
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-headline font-black text-foreground">{t('global_pulse')}</h2>
              <button 
                onClick={() => router.back()}
                className="hidden md:flex p-1.5 hover:bg-muted text-muted-foreground hover:text-rose-500 rounded-lg transition-all"
                title="Tutup Halaman"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input 
                placeholder={t('search_chats')}
                className="pl-10 h-11 bg-card border-border rounded-xl font-medium text-sm focus:ring-accent/10"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-2 pb-6 space-y-1">
            {CHATS.map((chat) => (
              <div 
                key={chat.id} 
                onClick={() => setSelectedChat(chat)}
                className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${selectedChat.id === chat.id ? 'bg-card shadow-md border border-border' : 'hover:bg-muted/50'}`}
              >
                <div className="relative">
                  <Avatar className="size-12 border border-border shadow-sm">
                    <AvatarImage src={chat.avatar} />
                    <AvatarFallback>{chat.name[0]}</AvatarFallback>
                  </Avatar>
                  {chat.status === 'online' && <div className="absolute bottom-0 right-0 size-3 bg-emerald-500 rounded-full border-2 border-card shadow-sm" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-foreground truncate">{chat.name}</h4>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">{chat.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium truncate leading-none">{chat.lastMsg}</p>
                </div>
                {chat.unread > 0 && (
                  <Badge className="size-5 rounded-full p-0 flex items-center justify-center bg-accent text-white text-[10px] font-black border-none">
                    {chat.unread}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 hidden md:flex flex-col bg-card">
          <header className="h-20 border-b border-border px-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="size-10 border border-border shadow-sm">
                <AvatarImage src={selectedChat.avatar} />
                <AvatarFallback>{selectedChat.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold text-foreground">{selectedChat.name}</h3>
                <div className="flex items-center gap-1.5">
                  <div className={`size-1.5 rounded-full ${selectedChat.status === 'online' ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{getStatusLabel(selectedChat.status)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-muted rounded-full"><Phone className="size-5" /></Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-muted rounded-full"><Video className="size-5" /></Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-muted rounded-full"><Globe className="size-5" /></Button>
              <div className="w-px h-6 bg-border mx-2" />
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-muted rounded-full"><MoreVertical className="size-5" /></Button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-muted/5">
            <div className="flex flex-col gap-1 max-w-[70%]">
              <div className="bg-muted rounded-2xl rounded-tl-none p-4 text-sm font-medium text-foreground/80 shadow-sm border border-border">
                Hi! We're reviewing your request for the eco-packaging bulk order.
              </div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">10:28 AM</span>
            </div>

            <div className="flex flex-col gap-1 max-w-[70%] ml-auto items-end">
              <div className="bg-accent text-white rounded-2xl rounded-tr-none p-4 text-sm font-medium shadow-lg">
                Great. Did you receive the technical specifications for the reinforced bottom?
              </div>
              <span className="text-[10px] font-bold text-accent/70 uppercase tracking-widest pr-1">10:29 AM</span>
            </div>

            <div className="flex flex-col gap-1 max-w-[70%]">
              <div className="bg-muted rounded-2xl rounded-tl-none p-4 text-sm font-medium text-foreground/80 shadow-sm border border-border">
                Yes, it looks good. The shipment was sent this morning. Tracking #ONTP-882211.
              </div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">10:30 AM</span>
            </div>
          </div>

          <footer className="p-6 bg-card border-t border-border">
            <div className="flex items-center gap-4 bg-muted/50 p-2 rounded-2xl border border-border focus-within:ring-2 focus-within:ring-accent/10 transition-all">
              <Button variant="ghost" size="icon" className="text-muted-foreground rounded-full"><Info className="size-5" /></Button>
              <Input 
                placeholder={t('type_message')}
                className="border-none bg-transparent h-10 font-medium text-sm focus:ring-0 placeholder:text-muted-foreground"
              />
              <Button className="size-10 rounded-xl bg-accent hover:bg-accent/80 text-white shadow-md p-0 shrink-0">
                <Send className="size-5" />
              </Button>
            </div>
          </footer>
        </div>
      </div>
    </DashboardLayout>
  );
}
