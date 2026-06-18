
"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Send, Phone, Video, Info, MoreVertical, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CHATS = [
  { id: 1, name: "Eco Packaging Co", avatar: "https://picsum.photos/seed/eco/100", lastMsg: "The shipment was sent this morning.", time: "10:30 AM", unread: 2, status: "online" },
  { id: 2, name: "FastTrack Logistics", avatar: "https://picsum.photos/seed/log/100", lastMsg: "We need the updated PO for the Rotterdam route.", time: "Yesterday", unread: 0, status: "offline" },
  { id: 3, name: "Skyline Ventures", avatar: "https://picsum.photos/seed/invest/100", lastMsg: "Looking forward to our sync next week.", time: "2 days ago", unread: 0, status: "online" },
  { id: 4, name: "Alpha Tech Hardware", avatar: "https://picsum.photos/seed/tech/100", lastMsg: "Price list for Q4 is attached below.", time: "3 days ago", unread: 0, status: "away" },
];

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = React.useState(CHATS[0]);

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-12rem)] flex overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-xl">
        {/* Chat List */}
        <div className="w-full md:w-80 lg:w-96 border-r border-slate-100 flex flex-col bg-slate-50/30">
          <div className="p-6 space-y-4">
            <h2 className="text-xl font-headline font-black text-slate-900">Global Pulse</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input 
                placeholder="Search conversations..." 
                className="pl-10 h-11 bg-white border-slate-100 rounded-xl font-medium text-sm focus:ring-accent/10"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-2 pb-6 space-y-1">
            {CHATS.map((chat) => (
              <div 
                key={chat.id} 
                onClick={() => setSelectedChat(chat)}
                className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${selectedChat.id === chat.id ? 'bg-white shadow-md' : 'hover:bg-slate-100'}`}
              >
                <div className="relative">
                  <Avatar className="size-12 border shadow-sm">
                    <AvatarImage src={chat.avatar} />
                    <AvatarFallback>{chat.name[0]}</AvatarFallback>
                  </Avatar>
                  {chat.status === 'online' && <div className="absolute bottom-0 right-0 size-3 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-slate-900 truncate">{chat.name}</h4>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{chat.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium truncate leading-none">{chat.lastMsg}</p>
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

        {/* Message Area */}
        <div className="flex-1 hidden md:flex flex-col bg-white">
          <header className="h-20 border-b border-slate-50 px-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="size-10 border shadow-sm">
                <AvatarImage src={selectedChat.avatar} />
                <AvatarFallback>{selectedChat.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold text-slate-900">{selectedChat.name}</h3>
                <div className="flex items-center gap-1.5">
                  <div className={`size-1.5 rounded-full ${selectedChat.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedChat.status}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-slate-400 hover:bg-slate-50 rounded-full"><Phone className="size-5" /></Button>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:bg-slate-50 rounded-full"><Video className="size-5" /></Button>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:bg-slate-50 rounded-full"><Globe className="size-5" /></Button>
              <div className="w-px h-6 bg-slate-100 mx-2" />
              <Button variant="ghost" size="icon" className="text-slate-400 hover:bg-slate-50 rounded-full"><MoreVertical className="size-5" /></Button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/20">
            {/* Mock messages */}
            <div className="flex flex-col gap-1 max-w-[70%]">
              <div className="bg-slate-100 rounded-2xl rounded-tl-none p-4 text-sm font-medium text-slate-700 shadow-sm border border-slate-200">
                Hi! We're reviewing your request for the eco-packaging bulk order.
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">10:28 AM</span>
            </div>

            <div className="flex flex-col gap-1 max-w-[70%] ml-auto items-end">
              <div className="bg-accent text-white rounded-2xl rounded-tr-none p-4 text-sm font-medium shadow-lg">
                Great. Did you receive the technical specifications for the reinforced bottom?
              </div>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest pr-1">10:29 AM</span>
            </div>

            <div className="flex flex-col gap-1 max-w-[70%]">
              <div className="bg-slate-100 rounded-2xl rounded-tl-none p-4 text-sm font-medium text-slate-700 shadow-sm border border-slate-200">
                Yes, it looks good. The shipment was sent this morning. Tracking #ONTP-882211.
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">10:30 AM</span>
            </div>
          </div>

          <footer className="p-6 bg-white border-t border-slate-50">
            <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100 focus-within:ring-2 focus-within:ring-accent/10 transition-all">
              <Button variant="ghost" size="icon" className="text-slate-400 rounded-full"><Info className="size-5" /></Button>
              <Input 
                placeholder="Type a secure message..." 
                className="border-none bg-transparent h-10 font-medium text-sm focus:ring-0 placeholder:text-slate-400"
              />
              <Button className="size-10 rounded-xl bg-accent hover:bg-indigo-400 text-white shadow-md p-0 shrink-0">
                <Send className="size-5" />
              </Button>
            </div>
          </footer>
        </div>
      </div>
    </DashboardLayout>
  );
}
