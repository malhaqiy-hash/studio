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
      title: 'OnTapp - Business Network',
      text: 'Lihat konten menarik ini di OnTapp!',
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
      window.open(app.url, '_blank');
      onOpenChange(false);
    } else {
      if (app.isNative) handleCopyLink();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 border-none bg-card text-foreground rounded-t-[2.5rem] sm:rounded-[3rem] overflow-hidden outline-none shadow-2xl flex flex-col max-h-[90vh] [&>button]:hidden">
        <div className="w-full flex flex-col items-center justify-center pt-4 pb-2"><div className="w-12 h-1 bg-muted rounded-full" /></div>
        <div className="p-6 pt-2 pb-4">
          <h3 className="text-xl font-black uppercase tracking-tight">Bagikan Konten</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar px-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center bg-muted/50 rounded-2xl p-1.5 pl-4 border border-border group focus-within:border-black transition-all">
              <p className="text-[12px] text-muted-foreground truncate flex-1 font-medium select-all">{postUrl}</p>
              <Button onClick={handleCopyLink} size="sm" variant="ghost" className="rounded-xl hover:bg-black/5">
                {copied ? <Check className="size-4 text-black" /> : <Copy className="size-4" />}
              </Button>
            </div>
            <Input 
              placeholder="Cari teman..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 pl-4 bg-muted/20 border-none rounded-2xl text-[14px]"
            />
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Koneksi OnTapp</span>
            <div className="grid grid-cols-4 gap-4">
              {filteredFriends.map((friend) => (
                <button 
                  key={friend.id} 
                  onClick={() => toggleFriendSelection(friend.id)}
                  className="flex flex-col items-center gap-1 group"
                >
                  <Avatar className={cn("size-14 border-2", selectedFriends.includes(friend.id) ? "border-black" : "border-transparent")}>
                    <AvatarImage src={friend.avatar} className="object-cover" />
                    <AvatarFallback className="bg-muted font-black text-xs">{friend.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-[10px] font-bold truncate w-full text-center">{friend.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-muted/10 -mx-6 p-8 pt-6 rounded-t-[3rem] border-t border-border">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6 block">Aplikasi Luar</span>
            <div className="grid grid-cols-4 gap-y-8 gap-x-4">
              {EXTERNAL_APPS.map((app, i) => (
                <button key={i} onClick={() => handleExternalShare(app)} className="flex flex-col items-center gap-2 group active:scale-90 transition-all">
                  <div className="size-14 rounded-[1.25rem] bg-black flex items-center justify-center shadow-xl">
                    <app.icon className="size-6 text-white" />
                  </div>
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter">{app.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}