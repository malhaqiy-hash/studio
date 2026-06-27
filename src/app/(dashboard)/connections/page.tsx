'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useAccount } from '@/context/account-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  X, 
  ChevronLeft,
  MessageSquare,
  Send,
  Plus,
  Image as ImageIcon,
  Camera,
  MapPin,
  User,
  FileText,
  Link as LinkIcon,
  MoreVertical,
  BellOff,
  Eraser,
  Trash2,
  Clock
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';
import Link from 'next/link';
import { cn } from '@/lib/utils';
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

const MOCK_CONNECTIONS = [
  { id: 'conn1', name: 'Andi Wijaya', avatar: 'https://picsum.photos/seed/f1/100', type: 'Professional', status: 'online' },
  { id: 'conn2', name: 'Budi Santoso', avatar: 'https://picsum.photos/seed/f2/100', type: 'Bisnis', status: 'offline' },
  { id: 'conn3', name: 'Siti Aminah', avatar: 'https://picsum.photos/seed/f3/100', type: 'Personal', status: 'online' },
  { id: 'conn4', name: 'Rina Kartika', avatar: 'https://picsum.photos/seed/f4/100', type: 'Bisnis', status: 'offline' },
];

const DEFAULT_MESSAGES = [
  { id: 'm1', sender: 'other', text: "Halo! Senang bisa terhubung dengan Anda di Koolink.", type: 'text', time: '10:00' },
  { id: 'm2', sender: 'me', text: "Halo juga! Mari kita berkolaborasi.", type: 'text', time: '10:05' }
];

export default function ConnectionsPage() {
  const { t, language } = useLanguage();
  const { activeAccount } = useAccount();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = React.useState("");
  const [connections, setConnections] = React.useState(MOCK_CONNECTIONS);
  const [confirmDisconnectId, setConfirmDisconnectId] = React.useState<string | null>(null);
  
  // Chat States
  const [selectedChat, setSelectedChat] = React.useState<any>(null);
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<any[]>(DEFAULT_MESSAGES);
  const [inputText, setInputText] = React.useState("");
  const [isMuted, setIsMuted] = React.useState(false);

  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isChatOpen]);

  const filteredConnections = connections.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDisconnect = () => {
    if (confirmDisconnectId) {
      setConnections(prev => prev.filter(c => c.id !== confirmDisconnectId));
      setConfirmDisconnectId(null);
      toast({ title: "Koneksi diputuskan" });
    }
  };

  const handleOpenChat = (conn: any) => {
    setSelectedChat(conn);
    setIsChatOpen(true);
  };

  const handleSendText = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      text: inputText,
      type: 'text',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMsg]);
    setInputText("");
  };

  const handleAction = (action: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    switch(action) {
      case 'location':
        setMessages(prev => [...prev, { id: `loc-${Date.now()}`, sender: 'me', text: "Lokasi Dibagikan", type: 'location', detail: "Jakarta, Indonesia", time }]);
        break;
      case 'contact':
        setMessages(prev => [...prev, { id: `cont-${Date.now()}`, sender: 'me', text: activeAccount.name, type: 'contact', detail: activeAccount.type, time }]);
        break;
    }
    toast({ title: "Aksi berhasil dikirim" });
  };

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto space-y-6 py-2 px-1 pb-24">
        <header className="space-y-4">
          <Link href="/settings">
            <Button variant="ghost" size="sm" className="pl-0 h-6 text-[10px] text-slate-400 hover:text-primary font-black uppercase tracking-widest gap-1.5 active:scale-95 transition-all">
              <ChevronLeft className="size-3" />
              {language === 'id' ? 'Kembali' : 'Back'}
            </Button>
          </Link>
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-primary font-black text-[8px] uppercase tracking-[0.2em]">
              <ConnectIcon className="size-3" />
              {t('connections')}
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">Jaringan Bisnis</h1>
            <p className="text-slate-500 font-medium text-[11px] leading-snug">Kelola seluruh relasi strategis Anda di ekosistem Koolink.</p>
          </div>
        </header>

        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <Input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama relasi..." 
            className="h-12 pl-11 pr-4 rounded-2xl border-slate-100 bg-white shadow-sm text-[14px] font-medium focus:ring-4 focus:ring-primary/5 transition-all"
          />
        </div>

        <div className="space-y-2">
          {filteredConnections.length > 0 ? (
            filteredConnections.map((conn) => (
              <Card key={conn.id} className="rounded-2xl border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden bg-card">
                <CardContent className="p-3 flex items-center justify-between gap-3">
                  <Link href="/profile" className="flex items-center gap-3 min-w-0 flex-1 hover:opacity-80 transition-opacity">
                    <div className="relative shrink-0">
                      <Avatar className="size-12 rounded-xl border border-border shadow-sm">
                        <AvatarImage src={conn.avatar} className="object-cover" />
                        <AvatarFallback className="bg-primary/5 text-primary font-black text-sm">{conn.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className={cn(
                        "absolute -bottom-0.5 -right-0.5 size-3 border-2 border-white rounded-full",
                        conn.status === 'online' ? "bg-emerald-500" : "bg-slate-300"
                      )} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-[14px] text-slate-900 truncate uppercase tracking-tight">{conn.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="outline" className="text-[7px] h-4 font-black uppercase tracking-widest border-primary/20 bg-primary/5 text-primary/80 px-1.5">
                          {conn.type}
                        </Badge>
                        <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Terhubung</span>
                      </div>
                    </div>
                  </Link>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleOpenChat(conn)}
                      className="size-9 rounded-xl bg-slate-50 text-slate-400 hover:text-primary active:scale-90 transition-all"
                    >
                      <MessageSquare className="size-4" />
                    </Button>
                    <button 
                      onClick={() => setConfirmDisconnectId(conn.id)}
                      className="size-9 flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-500 active:scale-90 transition-all"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="py-24 text-center space-y-4 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
               <div className="size-16 rounded-full bg-white flex items-center justify-center mx-auto shadow-md">
                  <ConnectIcon className="size-8 text-slate-200" />
               </div>
               <div className="space-y-1">
                  <h3 className="text-sm font-black text-slate-900 uppercase">Tidak Ada Relasi</h3>
                  <p className="text-[10px] text-slate-400 max-w-[200px] mx-auto font-medium">
                    {searchTerm ? "Tidak ada koneksi yang sesuai dengan pencarian Anda." : "Mulai bangun jaringan Anda dengan mencari mitra strategis."}
                  </p>
               </div>
            </div>
          )}
        </div>

        {/* Chat Dialog */}
        <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
          <DialogContent className="w-[95%] h-[85dvh] max-w-lg p-0 border-none rounded-t-3xl sm:rounded-3xl bg-card text-foreground outline-none shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-300 z-[170] [&>button]:hidden">
            {selectedChat && (
              <div className="flex flex-col h-full overflow-hidden">
                <header className="h-14 border-b border-border px-4 flex items-center justify-between bg-card shrink-0">
                  <div className="flex items-center gap-2.5">
                    <button onClick={() => setIsChatOpen(false)} className="size-8 flex items-center justify-center text-muted-foreground hover:text-primary active:scale-90 transition-all">
                      <ChevronLeft className="size-5" />
                    </button>
                    <Avatar className="size-8 border border-border">
                      <AvatarImage src={selectedChat.avatar} className="object-cover" />
                      <AvatarFallback className="text-[9px]">{selectedChat.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <h3 className="font-black text-[12px] leading-none truncate max-w-[150px] uppercase tracking-tight">{selectedChat.name}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <div className={cn("size-1.5 rounded-full", selectedChat.status === 'online' ? 'bg-emerald-500' : 'bg-muted-foreground')} />
                        <span className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">{selectedChat.status}</span>
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="size-8 rounded-lg text-muted-foreground hover:text-black flex items-center justify-center outline-none"><MoreVertical className="size-4" /></button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl p-1 shadow-2xl border-border bg-card z-[180]">
                      <DropdownMenuItem onClick={() => setIsMuted(!isMuted)} className="gap-2.5 px-3 py-2.5 rounded-lg font-bold text-[10px] cursor-pointer"><BellOff className="size-3.5" /> {isMuted ? "Aktifkan Suara" : "Senyapkan"}</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setMessages([])} className="gap-2.5 px-3 py-2.5 rounded-lg font-bold text-[10px] cursor-pointer"><Eraser className="size-3.5" /> Bersihkan Riwayat</DropdownMenuItem>
                      <div className="h-px bg-border my-1" />
                      <DropdownMenuItem className="gap-2.5 px-3 py-2.5 rounded-lg font-bold text-rose-500 hover:bg-rose-50 text-[10px] cursor-pointer"><Trash2 className="size-3.5" /> Blokir Kontak</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </header>

                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/5 scroll-smooth">
                  {messages.map((msg, i) => (
                    <div key={i} className={cn("flex flex-col gap-1 max-w-[85%]", msg.sender === 'me' ? "ml-auto items-end" : "items-start")}>
                      <div className={cn(
                        "p-3 text-[11px] font-medium shadow-sm border border-border leading-relaxed rounded-xl",
                        msg.sender === 'me' ? "bg-black text-white rounded-tr-none border-none" : "bg-card text-foreground rounded-tl-none"
                      )}>
                        {msg.type === 'text' && msg.text}
                        {msg.type === 'location' && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2"><MapPin className="size-4 text-rose-500" /> <span className="font-bold">{msg.detail}</span></div>
                            <div className="w-full aspect-video bg-slate-100 rounded-lg flex items-center justify-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">Map Preview</div>
                          </div>
                        )}
                        {msg.type === 'contact' && (
                          <div className="flex items-center gap-3 bg-black/5 p-2 rounded-lg border border-black/10">
                            <div className="size-8 rounded-lg bg-white flex items-center justify-center shadow-sm"><User className="size-4 text-primary" /></div>
                            <div><p className="font-bold leading-none">{msg.text}</p><p className="text-[9px] opacity-60 uppercase font-black tracking-widest mt-1">{msg.detail}</p></div>
                          </div>
                        )}
                      </div>
                      <span className="text-[7px] font-black text-muted-foreground uppercase">{msg.time}</span>
                    </div>
                  ))}
                </div>

                <footer className="p-3 border-t border-border bg-card shrink-0 pb-safe">
                  <form onSubmit={handleSendText} className="flex items-center gap-2 bg-muted/50 p-1 rounded-xl border border-border">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8 rounded-lg text-muted-foreground hover:text-black transition-all">
                          <Plus className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" side="top" className="w-48 rounded-xl p-1 shadow-2xl border-border bg-card animate-in slide-in-from-bottom-2 z-[180]">
                        <DropdownMenuItem className="gap-2.5 px-3 py-2.5 rounded-lg font-bold text-[10px] cursor-pointer"><ImageIcon className="size-3.5 text-blue-500" /> Foto</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2.5 px-3 py-2.5 rounded-lg font-bold text-[10px] cursor-pointer"><Camera className="size-3.5 text-rose-500" /> Kamera</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('location')} className="gap-2.5 px-3 py-2.5 rounded-lg font-bold text-[10px] cursor-pointer"><MapPin className="size-3.5 text-emerald-500" /> Lokasi</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('contact')} className="gap-2.5 px-3 py-2.5 rounded-lg font-bold text-[10px] cursor-pointer"><User className="size-3.5" /> Kontak</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2.5 px-3 py-2.5 rounded-lg font-bold text-[10px] cursor-pointer"><FileText className="size-3.5 text-indigo-500" /> Dokumen</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <Input 
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Ketik pesan..." 
                      className="border-none bg-transparent h-9 focus-visible:ring-0 text-[13px] flex-1" 
                    />
                    <Button type="submit" size="icon" className="size-9 rounded-lg bg-black text-white p-0 active:scale-95 transition-transform"><Send className="size-4" /></Button>
                  </form>
                </footer>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Disconnect Confirmation Dialog */}
        <Dialog open={!!confirmDisconnectId} onOpenChange={(open) => !open && setConfirmDisconnectId(null)}>
          <DialogContent className="w-[90%] md:max-w-[320px] rounded-[2rem] border-none shadow-2xl p-6 bg-card text-foreground outline-none z-[200] [&>button]:hidden text-center">
            <div className="space-y-6">
              <div className="size-16 rounded-[1.5rem] bg-rose-50 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
                 <X className="size-8" />
              </div>
              <div className="space-y-2">
                <DialogTitle className="text-lg font-black uppercase tracking-tight">Putus Koneksi?</DialogTitle>
                <DialogDescription className="text-[11px] font-medium text-slate-500 leading-relaxed px-4">
                  Tindakan ini akan menghapus akses khusus dan sinergi jaringan antara profil Anda.
                </DialogDescription>
              </div>
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={handleDisconnect} 
                  className="w-full h-11 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-rose-100"
                >
                  Putus Koneksi
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setConfirmDisconnectId(null)}
                  className="w-full h-10 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50"
                >
                  Batal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
