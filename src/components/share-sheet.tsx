'use client';

import * as React from 'react';
import { 
  Copy, 
  Search, 
  Check,
  MessageCircleCode,
  Instagram,
  Facebook,
  Music,
  Youtube,
  ShoppingBag,
  Linkedin,
  Chrome,
  Share2,
  Mail,
  Twitter,
  SendHorizontal,
  Slack,
  QrCode,
  X
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const MOCK_FRIENDS = [
  { id: 'f1', name: 'Andi Wijaya', avatar: 'https://picsum.photos/seed/f1/100', status: 'online' },
  { id: 'f2', name: 'Fitriani Rois', avatar: 'https://picsum.photos/seed/f2/100', status: 'offline' },
  { id: 'f3', name: 'Ahmad Umar', avatar: 'https://picsum.photos/seed/f3/100', status: 'online' },
  { id: 'f4', name: 'M. Syarif', avatar: 'https://picsum.photos/seed/f4/100', active: '37m' },
];

const EXTERNAL_APPS = [
  { name: 'Sistem', icon: Share2, color: 'bg-black', isNative: true },
  { name: 'WhatsApp', icon: MessageCircleCode, color: 'bg-black', url: 'whatsapp://send?text=' },
  { name: 'Instagram', icon: Instagram, color: 'bg-black', url: 'instagram://' },
  { name: 'Telegram', icon: SendHorizontal, color: 'bg-black', url: 'tg://msg?text=' },
  { name: 'Facebook', icon: Facebook, color: 'bg-black', url: 'fb://' },
  { name: 'Twitter', icon: Twitter, color: 'bg-black', url: 'twitter://' },
  { name: 'Gmail', icon: Mail, color: 'bg-black', url: 'googlegmail://' },
  { name: 'TikTok', icon: Music, color: 'bg-black', url: 'snssdk1128://' },
  { name: 'LinkedIn', icon: Linkedin, color: 'bg-black', url: 'linkedin://' },
];

interface ShareSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  postUrl: string;
}

export function ShareSheet({ isOpen, onOpenChange, postUrl }: ShareSheetProps) {
  const { toast } = useToast();
  const [search, setSearch] = React.useState('');
  const [copied, setCopied] = React.useState(false);
  const [selectedFriends, setSelectedFriends] = React.useState<string[]>([]);
  const isProfile = postUrl.includes('/profile/');

  const filteredFriends = MOCK_FRIENDS.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopyLink = () => {
    navigator.clipboard.writeText(postUrl);
    setCopied(true);
    toast({ title: 'Tautan disalin!' });
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFriendSelection = (id: string) => {
    setSelectedFriends(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const handleExternalShare = async (app: typeof EXTERNAL_APPS[0]) => {
    const shareData = {
      title: 'Tapp - Business Network',
      text: 'Lihat konten menarik ini di Tapp!',
      url: postUrl,
    };

    if (app.isNative && navigator.share) {
      try {
        await navigator.share(shareData);
        onOpenChange(false);
      } catch (err) {
        console.log('Native share failed');
      }
      return;
    }

    if (app.url) {
      window.open(app.url + encodeURIComponent(postUrl), '_blank');
      onOpenChange(false);
    } else {
      if (app.isNative) handleCopyLink();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 border-none bg-card text-foreground rounded-t-[2rem] sm:rounded-[2.5rem] overflow-hidden outline-none shadow-2xl flex flex-col max-h-[90vh] [&>button]:hidden">
        {/* Drag Handle for mobile */}
        <div className="w-full flex flex-col items-center justify-center pt-4 pb-2">
          <div className="w-12 h-1.5 bg-muted rounded-full" />
        </div>
        
        <div className="px-6 flex items-center justify-between pb-2">
          <h3 className="text-xl font-black uppercase tracking-tight">Bagikan</h3>
          <button onClick={() => onOpenChange(false)} className="p-2 rounded-full hover:bg-muted transition-colors">
            <X className="size-5 text-muted-foreground" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar px-6 space-y-6 pb-10">
          {isProfile && (
            <div className="bg-muted/10 rounded-[2rem] p-6 border border-border flex flex-col items-center space-y-4 animate-in fade-in zoom-in-95 duration-500">
               <div className="relative p-4 bg-white rounded-3xl shadow-xl">
                  <div className="size-44 bg-slate-50 flex items-center justify-center relative overflow-hidden rounded-xl">
                    <div className="grid grid-cols-5 grid-rows-5 gap-2 opacity-80">
                      {[...Array(25)].map((_, i) => (
                        <div key={i} className={cn("size-5 rounded-[4px]", (i % 3 === 0 || i % 7 === 0) ? "bg-black" : "bg-transparent")} />
                      ))}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="size-12 rounded-2xl bg-black text-white flex items-center justify-center font-black text-xl shadow-2xl ring-4 ring-white">T</div>
                    </div>
                  </div>
               </div>
               <div className="text-center space-y-1">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Scan QR Profil</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Identitas Bisnis Instan</p>
               </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center bg-muted/30 rounded-2xl p-1.5 pl-4 border border-border group focus-within:border-black transition-all">
              <p className="text-[12px] text-muted-foreground truncate flex-1 font-medium select-all">{postUrl}</p>
              <Button onClick={handleCopyLink} size="sm" variant="ghost" className="rounded-xl hover:bg-black/5 h-10 w-10 p-0">
                {copied ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input 
                placeholder="Kirim ke teman Tapp..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 pl-11 bg-muted/20 border-none rounded-2xl text-[14px] font-medium"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Koneksi Aktif</span>
              <span className="text-[10px] font-bold text-accent">Lihat Semua</span>
            </div>
            <div className="flex overflow-x-auto no-scrollbar gap-5 pb-2 -mx-2 px-2">
              {filteredFriends.map((friend) => (
                <button 
                  key={friend.id} 
                  onClick={() => toggleFriendSelection(friend.id)}
                  className="flex flex-col items-center gap-2 group min-w-[64px]"
                >
                  <div className="relative">
                    <Avatar className={cn("size-14 border-2 transition-all duration-300", selectedFriends.includes(friend.id) ? "border-black scale-110 shadow-lg" : "border-transparent")}>
                      <AvatarImage src={friend.avatar} className="object-cover" />
                      <AvatarFallback className="bg-black/5 font-black text-xs">{friend.name[0]}</AvatarFallback>
                    </Avatar>
                    {selectedFriends.includes(friend.id) && (
                      <div className="absolute -top-1 -right-1 bg-black text-white rounded-full p-1 border-2 border-card">
                        <Check className="size-2" />
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-bold truncate w-full text-center text-slate-700">{friend.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-muted/10 -mx-6 p-8 pt-6 rounded-t-[2.5rem] border-t border-border">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6 block text-center">Aplikasi & Media</span>
            <div className="grid grid-cols-4 gap-y-8 gap-x-4">
              {EXTERNAL_APPS.map((app, i) => (
                <button key={i} onClick={() => handleExternalShare(app)} className="flex flex-col items-center gap-2 group active:scale-90 transition-all">
                  <div className="size-14 rounded-[1.25rem] bg-black flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform">
                    <app.icon className="size-6 text-white" />
                  </div>
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter text-center">{app.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {selectedFriends.length > 0 && (
          <div className="absolute bottom-6 left-6 right-6 animate-in slide-in-from-bottom-4 duration-300">
            <Button className="w-full h-14 bg-black text-white font-black uppercase tracking-widest rounded-2xl shadow-2xl flex gap-2">
              Kirim ke {selectedFriends.length} Kontak
              <SendHorizontal className="size-4" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
